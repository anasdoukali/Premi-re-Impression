import { desc } from "drizzle-orm";
import { db } from "@/db";
import { projectRequests } from "@/db/schema";
import { isAuthenticated } from "@/server/auth";

export const dynamic = "force-dynamic";

function cell(value: unknown) {
  if (value == null) return "";
  const s = typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

/** CSV export of every request — administration only. */
export async function GET() {
  if (!(await isAuthenticated())) {
    return new Response("Non autorisé", { status: 401 });
  }

  const rows = await db.select().from(projectRequests).orderBy(desc(projectRequests.createdAt));
  const header = [
    "reference",
    "type",
    "statut",
    "nom",
    "email",
    "telephone",
    "type_projet",
    "delai",
    "produit",
    "message",
    "fichier",
    "details",
    "recue_le",
  ];
  const lines = rows.map((r) =>
    [
      r.reference,
      r.kind,
      r.status,
      r.name,
      r.email,
      r.phone,
      r.projectType,
      r.deadline,
      r.productSlug,
      r.message,
      r.attachmentName,
      r.details,
      r.createdAt.toISOString(),
    ]
      .map(cell)
      .join(";"),
  );

  const csv = `\uFEFF${header.join(";")}\n${lines.join("\n")}`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="demandes-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
