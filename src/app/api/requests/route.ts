import { NextResponse } from "next/server";
import { db } from "@/db";
import { projectRequests } from "@/db/schema";
import { projectTypes } from "@/config/site";

export const dynamic = "force-dynamic";

const KINDS = ["contact", "quote", "cart"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Body = Record<string, unknown>;

function str(v: unknown, max = 500): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

function makeReference() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PI-${ymd}-${rand}`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  const kind = str(body.kind, 20);
  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  const projectType = str(body.projectType, 40);
  const deadline = str(body.deadline, 120);
  const message = str(body.message, 5000);
  const productSlug = str(body.productSlug, 120);
  const attachmentName = str(body.attachmentName, 255);
  const attachmentSize =
    typeof body.attachmentSize === "number" && Number.isFinite(body.attachmentSize)
      ? Math.round(body.attachmentSize)
      : null;

  const errors: Record<string, string> = {};
  if (!kind || !(KINDS as readonly string[]).includes(kind)) errors.kind = "Type de demande invalide.";
  if (!name || name.length < 2) errors.name = "Indiquez votre nom.";
  if (!email || !EMAIL_RE.test(email)) errors.email = "Adresse email invalide.";
  if (!message || message.length < 10) errors.message = "Décrivez votre besoin en quelques mots (10 caractères minimum).";
  if (projectType && !projectTypes.some((p) => p.value === projectType)) errors.projectType = "Type de projet invalide.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Certains champs sont à compléter.", fields: errors }, { status: 422 });
  }

  const details =
    body.details && typeof body.details === "object" ? JSON.parse(JSON.stringify(body.details).slice(0, 20000)) : null;

  try {
    const reference = makeReference();
    await db.insert(projectRequests).values({
      reference,
      kind: kind!,
      name: name!,
      email: email!,
      phone,
      projectType,
      deadline,
      message: message!,
      productSlug,
      details,
      attachmentName,
      attachmentSize,
    });
    return NextResponse.json({ ok: true, reference });
  } catch (err) {
    console.error("[requests] insert failed", err);
    return NextResponse.json(
      { error: "Votre demande n’a pas pu être enregistrée. Merci de réessayer dans un instant." },
      { status: 500 },
    );
  }
}
