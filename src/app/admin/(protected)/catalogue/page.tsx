import Link from "next/link";
import { listAllProducts } from "@/server/catalogue";
import { toggleProductPublished } from "../../actions";

export const dynamic = "force-dynamic";

export default async function CataloguePage() {
  const rows = await listAllProducts();

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="display display-sm">Catalogue</h1>
        <Link
          href="/admin/catalogue/nouveau"
          className="inline-flex min-h-11 items-center bg-espresso px-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ivory"
        >
          Nouveau produit
        </Link>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Les produits publiés apparaissent immédiatement sur le site. Le catalogue a été initialisé avec les produits
        livrés avec le site.
      </p>

      <div className="mt-8 overflow-x-auto border border-line bg-ivory">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Produits du catalogue</caption>
          <thead className="border-b border-line text-[0.65rem] uppercase tracking-[0.16em] text-ink-soft">
            <tr>
              <th scope="col" className="px-4 py-3">Produit</th>
              <th scope="col" className="px-4 py-3">Catégorie</th>
              <th scope="col" className="px-4 py-3">Parcours</th>
              <th scope="col" className="px-4 py-3">Prix</th>
              <th scope="col" className="px-4 py-3">État</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-sand/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/catalogue/${r.id}`} className="font-semibold underline underline-offset-4">
                    {r.name}
                  </Link>
                  <span className="block text-xs text-ink-soft">/{r.slug}</span>
                </td>
                <td className="px-4 py-3">{r.category}</td>
                <td className="px-4 py-3">{r.kind === "custom" ? "Sur mesure" : "Standard"}</td>
                <td className="px-4 py-3">
                  {r.priceFromCents != null ? `dès ${(r.priceFromCents / 100).toFixed(2)} € ${r.priceUnit}` : "sur devis"}
                </td>
                <td className="px-4 py-3">
                  {r.published ? "Publié" : <span className="text-espresso">Masqué</span>}
                  {r.featured && <span className="block text-xs text-ink-soft">Mis en avant</span>}
                </td>
                <td className="px-4 py-3">
                  <form action={toggleProductPublished}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="next" value={String(!r.published)} />
                    <button type="submit" className="text-xs font-semibold uppercase tracking-[0.12em] underline underline-offset-4">
                      {r.published ? "Masquer" : "Publier"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
