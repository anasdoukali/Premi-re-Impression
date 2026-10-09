import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MaskedHeadline } from "@/components/motion/MaskedHeadline";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/ui/Picture";
import { ProductConfigurator } from "@/components/products/ProductConfigurator";
import { ProductPreview } from "@/components/products/ProductPreview";
import { categoryLabel } from "@/data/products";
import { getPublicProduct, listProducts } from "@/server/catalogue";

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) return { title: "Produit introuvable" };
  return { title: product.name, description: `${product.tagline} ${product.description}` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, products] = await Promise.all([getPublicProduct(slug), listProducts()]);
  if (!product) notFound();

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-28 sm:px-8 md:pt-36 lg:px-12">
        <nav aria-label="Fil d’Ariane" className="text-xs text-ink-soft">
          <ol className="flex flex-wrap items-center gap-2 uppercase tracking-[0.14em]">
            <li><Link className="nav-link" href="/solutions">Solutions</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link className="nav-link" href={`/solutions?filtre=${product.category}`}>{categoryLabel[product.category]}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-espresso">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-40">
              <Reveal variant="image" className="relative aspect-[8/5] overflow-hidden rounded-2xl bg-sand lg:max-h-[calc(100dvh-14rem)] lg:w-full">
                <Picture image={product.images[0]} sizes="(min-width: 1024px) 56vw, 100vw" priority />
              </Reveal>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="relative aspect-[4/3] max-h-28 overflow-hidden rounded-xl bg-sand">
                  <Picture image={product.images[1]} sizes="(min-width: 1024px) 28vw, 50vw" />
                </div>
                <div className="flex max-h-28 flex-col justify-center rounded-xl bg-sand p-4">
                  <p className="eyebrow text-ink-soft">Personnalisable</p>
                  <p className="mt-2 font-display text-lg leading-snug">{product.customization.join(" · ")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="eyebrow text-ink-soft">
              {categoryLabel[product.category]} · {product.kind === "custom" ? "Sur devis" : "À configurer"}
            </p>
            <MaskedHeadline as="h1" size="md" className="mt-5" lines={[product.name]} />
            <Reveal delay={200}>
              <p className="mt-6 font-display text-2xl italic leading-snug">{product.tagline}</p>
              <p className="mt-4 leading-relaxed text-ink-soft">{product.description}</p>
              {product.express && (
                <p className="mt-6 border-l border-espresso/40 pl-4 text-sm leading-relaxed text-ink-soft">
                  Une sélection est disponible en express (4 h, voire 1 h selon le projet). Selon les quantités, les finitions et la
                  disponibilité. Délai confirmé avec notre équipe.
                </p>
              )}
            </Reveal>
            <div className="mt-12">
              <ProductConfigurator product={product} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-ivory py-24">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
            <h2 id="related-title" className="display display-sm">Dans le même esprit</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductPreview key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
