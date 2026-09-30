import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, projectRequests } from "@/db/schema";
import { requestKinds, requestStatuses } from "@/config/site";
import { getSettings } from "@/server/settings";

export const dynamic = "force-dynamic";

function Card({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const body = (
    <div className="border border-line bg-ivory p-5 transition-colors hover:border-espresso">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">{label}</p>
      <p className="mt-3 font-display text-4xl">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default async function AdminDashboard() {
  const [counts, statusRows, latest, productCount, settings] = await Promise.all([
    db
      .select({ kind: projectRequests.kind, n: sql<number>`count(*)::int` })
      .from(projectRequests)
      .groupBy(projectRequests.kind),
    db
      .select({ status: projectRequests.status, n: sql<number>`count(*)::int` })
      .from(projectRequests)
      .groupBy(projectRequests.status),
    db.select().from(projectRequests).orderBy(desc(projectRequests.createdAt)).limit(6),
    db.select({ n: sql<number>`count(*)::int` }).from(products),
    getSettings(),
  ]);

  const total = counts.reduce((a, c) => a + c.n, 0);
  const nouveaux = statusRows.find((s) => s.status === "nouveau")?.n ?? 0;

  return (
    <div className="space-y-12">
      <section>
        <h1 className="display display-sm">Tableau de bord</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card label="Demandes" value={total} href="/admin/demandes" />
          <Card label="Nouvelles" value={nouveaux} href="/admin/demandes?statut=nouveau" />
          <Card label="Produits" value={productCount[0]?.n ?? 0} href="/admin/catalogue" />
          <Card
            label="Services connectés"
            value={`${[settings.services.payment && "Paiement", settings.services.fileUpload && "Fichiers"].filter(Boolean).join(" · ") || "Aucun"}`}
            href="/admin/reglages"
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Par type</h2>
        <ul className="mt-4 flex flex-wrap gap-3 text-sm">
          {Object.entries(requestKinds).map(([k, label]) => (
            <li key={k} className="border border-line bg-ivory px-4 py-2">
              {label} : <strong>{counts.find((c) => c.kind === k)?.n ?? 0}</strong>
            </li>
          ))}
          {requestStatuses.map((s) => (
            <li key={s.value} className="border border-line bg-ivory px-4 py-2">
              {s.label} : <strong>{statusRows.find((r) => r.status === s.value)?.n ?? 0}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Dernières demandes</h2>
          <Link href="/admin/demandes" className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
            Tout voir
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">Aucune demande pour le moment.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border border-line bg-ivory">
            {latest.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/demandes/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-sand/40">
                  <span>
                    <strong>{r.name}</strong>{" "}
                    <span className="text-ink-soft">· {requestKinds[r.kind] ?? r.kind}</span>
                  </span>
                  <span className="text-xs text-ink-soft">
                    {r.reference} · {new Date(r.createdAt).toLocaleDateString("fr-FR")} ·{" "}
                    {requestStatuses.find((s) => s.value === r.status)?.label ?? r.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
