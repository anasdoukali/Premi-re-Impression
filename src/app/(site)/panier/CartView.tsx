"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { formatBytes } from "@/components/forms/FileField";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { images } from "@/data/images";
import { getProduct, type Product } from "@/data/products";

export function CartView({ products = [] }: { products?: Product[] }) {
  const { items, ready, remove } = useCart();
  const lookup = (slug: string) => products.find((p) => p.slug === slug) ?? getProduct(slug);

  if (!ready) {
    return <p className="py-20 text-ink-soft">Chargement du panier…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="border-t border-line py-20">
        <p className="font-display text-4xl">Votre panier est vide.</p>
        <p className="mt-4 max-w-md text-ink-soft">Choisissez un produit et personnalisez-le : nous nous occupons de la suite.</p>
        <div className="mt-10">
          <ArrowLink href="/solutions">Découvrir les solutions</ArrowLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <ul className="border-t border-line lg:col-span-8">
        {items.map((item) => {
          const product = lookup(item.slug);
          const img = product ? images[product.images[0]] : null;
          return (
            <li key={item.id} className="grid grid-cols-[88px_1fr] gap-5 border-b border-line py-8 sm:grid-cols-[140px_1fr] sm:gap-8">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                {img && <Image src={img.src} alt="" fill sizes="140px" className="object-cover" />}
              </div>
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h2 className="font-display text-3xl leading-none">
                    <Link href={`/solutions/${item.slug}`} className="hover:underline">{item.name}</Link>
                  </h2>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="min-h-11 text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
                    aria-label={`Retirer ${item.name} du panier`}
                  >
                    Retirer
                  </button>
                </div>
                <dl className="mt-4 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
                  {item.selections.map((s) => (
                    <div key={s.groupId} className="flex gap-2">
                      <dt className="text-ink-soft">{s.label} :</dt>
                      <dd>{s.valueLabel}</dd>
                    </div>
                  ))}
                  <div className="flex gap-2 sm:col-span-2">
                    <dt className="text-ink-soft">Fichier :</dt>
                    <dd>
                      {item.file.status === "selected"
                        ? `${item.file.name} (${formatBytes(item.file.size)}) — sélectionné, non transmis`
                        : item.file.status === "not-ready"
                          ? `Pas encore prêt${item.file.note ? ` — ${item.file.note}` : ""}`
                          : "—"}
                    </dd>
                  </div>
                  {item.assistance && (
                    <div className="flex gap-2 sm:col-span-2">
                      <dt className="text-ink-soft">Accompagnement :</dt>
                      <dd>Oui</dd>
                    </div>
                  )}
                  {item.notes && (
                    <div className="flex gap-2 sm:col-span-2">
                      <dt className="text-ink-soft">Précisions :</dt>
                      <dd>{item.notes}</dd>
                    </div>
                  )}
                </dl>
                <p className="mt-4 text-sm font-semibold">Prix confirmé sur devis</p>
              </div>
            </li>
          );
        })}
      </ul>

      <aside aria-labelledby="total-title" className="lg:col-span-4">
        <div className="bg-sand p-7 lg:sticky lg:top-28">
          <h2 id="total-title" className="eyebrow text-ink-soft">Votre sélection</h2>
          <p className="mt-4 font-display text-4xl">
            {items.length} article{items.length > 1 ? "s" : ""}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Les tarifs en ligne ne sont pas encore publiés : le prix et le délai vous sont confirmés avant toute production.
          </p>
          <ArrowLink href="/commande" arrow="e" className="mt-8 w-full">
            Passer à la commande
          </ArrowLink>
          <Link href="/solutions" className="mt-5 block text-center text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
            Continuer mes choix
          </Link>
        </div>
      </aside>
    </div>
  );
}
