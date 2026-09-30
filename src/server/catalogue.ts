import "server-only";
import { cache } from "react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable, type ProductRow } from "@/db/schema";
import { images, type ImageKey } from "@/data/images";
import {
  products as seedProducts,
  type Category,
  type OptionGroup,
  type Product,
} from "@/data/products";

const IMAGE_KEYS = Object.keys(images) as ImageKey[];
const CATEGORIES: Category[] = ["print", "textile", "objets", "signaletique"];

function asImageKey(v: string, fallback: ImageKey): ImageKey {
  return (IMAGE_KEYS as string[]).includes(v) ? (v as ImageKey) : fallback;
}

/** Validates the JSON option structure coming from the admin editor. */
export function parseOptions(value: unknown): OptionGroup[] {
  if (!Array.isArray(value)) return [];
  const groups: OptionGroup[] = [];
  for (const raw of value) {
    const g = (raw ?? {}) as Record<string, unknown>;
    const id = typeof g.id === "string" ? g.id.trim() : "";
    const label = typeof g.label === "string" ? g.label.trim() : "";
    const choicesRaw = Array.isArray(g.choices) ? g.choices : [];
    if (!id || !label || choicesRaw.length === 0) continue;
    const display = g.display === "list" || g.display === "swatches" ? g.display : "pills";
    const choices = choicesRaw
      .map((c) => {
        const ch = (c ?? {}) as Record<string, unknown>;
        const value = typeof ch.value === "string" ? ch.value.trim() : "";
        const cl = typeof ch.label === "string" ? ch.label.trim() : "";
        if (!value || !cl) return null;
        return {
          value,
          label: cl,
          hint: typeof ch.hint === "string" ? ch.hint : undefined,
          swatch: typeof ch.swatch === "string" ? ch.swatch : undefined,
        };
      })
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    if (choices.length) groups.push({ id, label, display, choices });
  }
  return groups;
}

export function rowToProduct(row: ProductRow): Product {
  const category = (CATEGORIES as string[]).includes(row.category) ? (row.category as Category) : "print";
  return {
    slug: row.slug,
    name: row.name,
    category,
    kind: row.kind === "custom" ? "custom" : "standard",
    tagline: row.tagline,
    description: row.description,
    customization: Array.isArray(row.customization) ? row.customization : [],
    images: [asImageKey(row.imagePrimary, "paper"), asImageKey(row.imageSecondary, "design")],
    options: parseOptions(row.options),
    price:
      row.priceFromCents != null ? { from: row.priceFromCents / 100, currency: "EUR", unit: row.priceUnit } : null,
    express: row.express,
    featured: row.featured,
  };
}

let seeding: Promise<void> | null = null;

/** Fills the catalogue table from the bundled data the first time it is empty. */
async function ensureSeeded() {
  if (seeding) return seeding;
  seeding = (async () => {
    const existing = await db.select({ id: productsTable.id }).from(productsTable).limit(1);
    if (existing.length) return;
    await db
      .insert(productsTable)
      .values(
        seedProducts.map((p, i) => ({
          slug: p.slug,
          name: p.name,
          category: p.category,
          kind: p.kind,
          tagline: p.tagline,
          description: p.description,
          customization: p.customization,
          imagePrimary: p.images[0],
          imageSecondary: p.images[1],
          options: p.options as unknown[],
          priceFromCents: p.price ? Math.round(p.price.from * 100) : null,
          priceUnit: p.price?.unit ?? "",
          express: Boolean(p.express),
          featured: Boolean(p.featured),
          published: true,
          position: i,
        })),
      )
      .onConflictDoNothing();
  })().catch((err) => {
    console.error("[catalogue] seed failed", err);
    seeding = null;
  });
  return seeding;
}

/** Published products for the public site. Falls back to bundled data on failure. */
export const listProducts = cache(async (): Promise<Product[]> => {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.published, true))
      .orderBy(asc(productsTable.position), asc(productsTable.id));
    if (!rows.length) return seedProducts;
    return rows.map(rowToProduct);
  } catch (err) {
    console.error("[catalogue] read failed, using bundled catalogue", err);
    return seedProducts;
  }
});

/** Every product, published or not — administration only. */
export async function listAllProducts(): Promise<ProductRow[]> {
  await ensureSeeded();
  return db.select().from(productsTable).orderBy(asc(productsTable.position), asc(productsTable.id));
}

export async function getProductRow(id: number): Promise<ProductRow | undefined> {
  const rows = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
  return rows[0];
}

export async function getPublicProduct(slug: string): Promise<Product | undefined> {
  const all = await listProducts();
  return all.find((p) => p.slug === slug);
}

export async function listFeatured(slugs: string[]): Promise<Product[]> {
  const all = await listProducts();
  const picked = slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
  return picked.length ? picked : all.filter((p) => p.featured).slice(0, 4);
}
