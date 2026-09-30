import type { Metadata } from "next";
import { MaskedHeadline } from "@/components/motion/MaskedHeadline";
import { Reveal } from "@/components/motion/Reveal";
import { Catalogue } from "@/components/products/Catalogue";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { categories, type Category } from "@/data/products";
import { listProducts } from "@/server/catalogue";

export const metadata: Metadata = {
  title: "Solutions & boutique",
  description: "Cartes de visite, papeterie, textile, objets et signalétique. Choisissez, personnalisez, nous vous accompagnons.",
};

export default async function SolutionsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [sp, products] = await Promise.all([searchParams, listProducts()]);
  const raw = typeof sp.filtre === "string" ? sp.filtre : "tout";
  const initial = (categories.some((c) => c.value === raw) ? raw : "tout") as Category | "tout";

  return (
    <>
      <section aria-labelledby="solutions-title" className="bg-ivory pb-16 pt-36 md:pb-24 md:pt-48">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 sm:px-8 md:grid-cols-12 lg:px-12">
          <div className="md:col-span-8">
            <Reveal as="p" className="eyebrow text-ink-soft">Solutions & boutique</Reveal>
            <MaskedHeadline as="h1" id="solutions-title" size="xl" className="mt-6" lines={["À chaque idée,", <span key="s">son <em>support</em>.</span>]} />
          </div>
          <Reveal delay={300} className="flex flex-col justify-end gap-6 md:col-span-4">
            <p className="text-lg leading-relaxed text-ink-soft">
              Choisissez un produit. Personnalisez-le. Nous vous accompagnons pour la suite.
            </p>
            <dl className="grid gap-4 border-t border-line pt-5 text-sm">
              <div>
                <dt className="font-semibold">Produits standards</dt>
                <dd className="text-ink-soft">Configurer, ajouter au panier, commander.</dd>
              </div>
              <div>
                <dt className="font-semibold">Projets sur mesure</dt>
                <dd className="text-ink-soft">Décrire votre besoin, recevoir un devis.</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section aria-label="Catalogue" className="bg-ivory pb-28">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <Catalogue initialFilter={initial} products={products} />
        </div>
      </section>

      <section aria-labelledby="sur-mesure-title" className="bg-sand py-24 md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 sm:px-8 md:grid-cols-12 lg:px-12">
          <MaskedHeadline id="sur-mesure-title" size="lg" className="md:col-span-7" lines={["Vous ne trouvez", "pas votre", <em key="s">support ?</em>]} />
          <Reveal delay={250} className="flex flex-col justify-end gap-8 md:col-span-5">
            <p className="text-lg leading-relaxed">
              Décrivez-nous votre idée : format particulier, matière, quantité, usage. Nous vous proposons la bonne solution.
            </p>
            <div>
              <ArrowLink href="/le-lieu#contact">Parler de mon projet</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
