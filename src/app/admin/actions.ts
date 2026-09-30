"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable, projectRequests, requestNotes } from "@/db/schema";
import { checkPassword, createSession, destroySession, isAuthenticated } from "@/server/auth";
import { saveSettings } from "@/server/settings";
import { parseOptions } from "@/server/catalogue";
import { requestStatuses, type AppSettings } from "@/config/site";
import { images } from "@/data/images";

export type ActionState = { error?: string; success?: string };

async function requireAuth() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function revalidatePublic() {
  revalidatePath("/", "layout");
}

/* ---------------- Authentication ---------------- */

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Saisissez le mot de passe." };
  if (!checkPassword(password)) return { error: "Mot de passe incorrect." };
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- Requests ---------------- */

export async function updateRequestStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAuth();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(id) || !requestStatuses.some((s) => s.value === status)) {
    return { error: "Statut invalide." };
  }
  await db
    .update(projectRequests)
    .set({ status, handledAt: status === "nouveau" ? null : new Date() })
    .where(eq(projectRequests.id, id));
  revalidatePath("/admin/demandes");
  revalidatePath(`/admin/demandes/${id}`);
  return { success: "Statut mis à jour." };
}

export async function addRequestNote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAuth();
  const id = Number(formData.get("id"));
  const body = String(formData.get("body") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim() || "Équipe";
  if (!Number.isInteger(id)) return { error: "Demande introuvable." };
  if (body.length < 2) return { error: "Écrivez une note." };
  await db.insert(requestNotes).values({ requestId: id, body: body.slice(0, 4000), author: author.slice(0, 80) });
  revalidatePath(`/admin/demandes/${id}`);
  return { success: "Note ajoutée." };
}

export async function deleteRequest(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    await db.delete(projectRequests).where(eq(projectRequests.id, id));
  }
  revalidatePath("/admin/demandes");
  redirect("/admin/demandes");
}

/* ---------------- Settings ---------------- */

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAuth();
  const text = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v ? v : null;
  };

  const hours: AppSettings["hours"] = [];
  for (let i = 0; i < 10; i++) {
    const days = String(formData.get(`hours-days-${i}`) ?? "").trim();
    const value = String(formData.get(`hours-value-${i}`) ?? "").trim();
    if (days && value) hours.push({ days, hours: value });
  }

  const email = text("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "Adresse email invalide." };
  const mapUrl = text("mapUrl");
  if (mapUrl && !/^https?:\/\//.test(mapUrl)) return { error: "Le lien de la carte doit commencer par http:// ou https://" };

  try {
    await saveSettings({
      contact: {
        address: text("address"),
        mapUrl,
        email,
        phone: text("phone"),
        whatsapp: text("whatsapp")?.replace(/[^\d]/g, "") || null,
      },
      hours,
      services: {
        payment: formData.get("payment") === "on",
        fileUpload: formData.get("fileUpload") === "on",
      },
      maxFileSizeMb: Number(formData.get("maxFileSizeMb") ?? 50),
    });
  } catch (err) {
    console.error("[admin] settings save failed", err);
    return { error: "Enregistrement impossible. Réessayez." };
  }
  revalidatePublic();
  return { success: "Réglages enregistrés." };
}

/* ---------------- Catalogue ---------------- */

const CATEGORIES = ["print", "textile", "objets", "signaletique"];
const IMAGE_KEYS = Object.keys(images);

function readProductForm(formData: FormData) {
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const kind = String(formData.get("kind") ?? "standard") === "custom" ? "custom" : "standard";
  const imagePrimary = String(formData.get("imagePrimary") ?? "");
  const imageSecondary = String(formData.get("imageSecondary") ?? "");
  const priceRaw = String(formData.get("priceFrom") ?? "").trim().replace(",", ".");
  const optionsRaw = String(formData.get("options") ?? "[]");

  if (!slug) return { error: "L’identifiant (slug) est obligatoire." as string };
  if (!name) return { error: "Le nom est obligatoire." };
  if (!CATEGORIES.includes(category)) return { error: "Catégorie invalide." };
  if (!IMAGE_KEYS.includes(imagePrimary) || !IMAGE_KEYS.includes(imageSecondary)) {
    return { error: "Visuel invalide." };
  }

  let options: unknown[];
  try {
    const parsed: unknown = JSON.parse(optionsRaw || "[]");
    if (!Array.isArray(parsed)) return { error: "Les options doivent être un tableau JSON." };
    options = parseOptions(parsed) as unknown[];
  } catch {
    return { error: "JSON des options invalide." };
  }

  let priceFromCents: number | null = null;
  if (priceRaw) {
    const n = Number(priceRaw);
    if (!Number.isFinite(n) || n < 0) return { error: "Prix invalide." };
    priceFromCents = Math.round(n * 100);
  }

  return {
    values: {
      slug,
      name,
      category,
      kind,
      tagline: String(formData.get("tagline") ?? "").trim().slice(0, 300),
      description: String(formData.get("description") ?? "").trim().slice(0, 2000),
      customization: String(formData.get("customization") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
      imagePrimary,
      imageSecondary,
      options,
      priceFromCents,
      priceUnit: String(formData.get("priceUnit") ?? "").trim().slice(0, 60),
      express: formData.get("express") === "on",
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      position: Number(formData.get("position") ?? 0) || 0,
      updatedAt: new Date(),
    },
  };
}

export async function saveProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAuth();
  const parsed = readProductForm(formData);
  if ("error" in parsed && parsed.error) return { error: parsed.error };
  const values = parsed.values!;
  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  try {
    if (id) {
      await db.update(productsTable).set(values).where(eq(productsTable.id, id));
    } else {
      const exists = await db
        .select({ id: productsTable.id })
        .from(productsTable)
        .where(eq(productsTable.slug, values.slug))
        .limit(1);
      if (exists.length) return { error: "Cet identifiant est déjà utilisé." };
      await db.insert(productsTable).values(values);
    }
  } catch (err) {
    console.error("[admin] product save failed", err);
    return { error: "Enregistrement impossible. Vérifiez les champs et réessayez." };
  }

  revalidatePublic();
  revalidatePath("/admin/catalogue");
  if (!id) redirect("/admin/catalogue");
  return { success: "Produit enregistré." };
}

export async function toggleProductPublished(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  const next = formData.get("next") === "true";
  if (Number.isInteger(id)) {
    await db.update(productsTable).set({ published: next, updatedAt: new Date() }).where(eq(productsTable.id, id));
  }
  revalidatePublic();
  revalidatePath("/admin/catalogue");
}

export async function deleteProduct(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    await db.delete(productsTable).where(and(eq(productsTable.id, id)));
  }
  revalidatePublic();
  revalidatePath("/admin/catalogue");
  redirect("/admin/catalogue");
}
