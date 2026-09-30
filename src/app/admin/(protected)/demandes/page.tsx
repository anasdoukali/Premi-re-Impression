import Link from "next/link";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { projectRequests } from "@/db/schema";
import { requestKinds, requestStatuses } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const statut = typeof sp.statut === "string" && requestStatuses.some((s) => s.value === sp.statut) ? sp.statut : null;
  const type = typeof sp.type === "string" && requestKinds[sp.type] ? sp.type : null;

  const filters: SQL[] = [];
  if (statut) filters.push(eq(projectRequests.status, statut));
  if (type) filters.push(eq(projectRequests.kind, type));

  const rows = await db
    .select()
    .from(projectRequests)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(projectRequests.createdAt))
    .limit(200);

  const chip = (label: string, href: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${
        active ? "border-espresso bg-espresso text-ivory" : "border-line bg-ivory hover:border-espresso"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="display display-sm">Demandes</h1>
        <a href="/api/admin/export" className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
          Exporter en CSV ↓
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {chip("Toutes", "/admin/demandes", !statut && !type)}
        {requestStatuses.map((s) =>
          chip(s.label, `/admin/demandes?statut=${s.value}`, statut === s.value),
        )}
        {Object.entries(requestKinds).map(([k, label]) => chip(label, `/admin/demandes?type=${k}`, type === k))}
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-ink-soft">Aucune demande ne correspond à ce filtre.</p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-line bg-ivory">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Liste des demandes clients</caption>
            <thead className="border-b border-line text-[0.65rem] uppercase tracking-[0.16em] text-ink-soft">
              <tr>
                <th scope="col" className="px-4 py-3">Référence</th>
                <th scope="col" className="px-4 py-3">Client</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Produit</th>
                <th scope="col" className="px-4 py-3">Statut</th>
                <th scope="col" className="px-4 py-3">Reçue le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-sand/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/demandes/${r.id}`} className="font-semibold underline underline-offset-4">
                      {r.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {r.name}
                    <span className="block text-xs text-ink-soft">{r.email}</span>
                  </td>
                  <td className="px-4 py-3">{requestKinds[r.kind] ?? r.kind}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.productSlug ?? "—"}</td>
                  <td className="px-4 py-3">{requestStatuses.find((s) => s.value === r.status)?.label ?? r.status}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {new Date(r.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
