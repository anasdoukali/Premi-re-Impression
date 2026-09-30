import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { images } from "@/data/images";
import { categoryLabel, formatPrice, type Product } from "@/data/products";

/** Image-first product preview: name, one line, customization, price or action. */
export function ProductPreview({
  product,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  aspect = "aspect-[4/5]",
  headingLevel = "h3",
}: {
  product: Product;
  sizes?: string;
  aspect?: string;
  headingLevel?: "h2" | "h3";
}) {
  const [a, b] = product.images;
  const primary = images[a];
  const secondary = images[b];
  const H = headingLevel;
  const action = product.kind === "custom" ? "Demander un devis" : "Configurer";

  return (
    <article className="group">
      <Link href={`/solutions/${product.slug}`} className="block" aria-label={`${product.name} — ${action}`}>
        <div className={`product-frame relative ${aspect} overflow-hidden bg-sand`}>
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            sizes={sizes}
            placeholder="blur"
            className="img-primary focal object-cover"
            style={{ "--pos-m": primary.focus.mobile, "--pos-d": primary.focus.desktop } as CSSProperties}
          />
          <Image
            src={secondary.src}
            alt=""
            fill
            sizes={sizes}
            className="img-secondary focal object-cover"
            style={{ "--pos-m": secondary.focus.mobile, "--pos-d": secondary.focus.desktop } as CSSProperties}
          />
          <span className="absolute left-4 top-4 bg-ivory/90 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-espresso">
            {categoryLabel[product.category]}
          </span>
        </div>
        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
          <div>
            <H className="font-display text-[2rem] font-medium leading-none md:text-[2.3rem]">{product.name}</H>
            <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-ink-soft">{product.tagline}</p>
            <p className="mt-3 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-soft">
              {product.customization.join(" · ")}
            </p>
            {product.price && <p className="mt-3 text-sm font-semibold">{formatPrice(product.price)}</p>}
          </div>
          <span className="mt-1 inline-flex shrink-0 items-center gap-2 border-b border-espresso/40 pb-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors group-hover:border-espresso">
            {action} <span aria-hidden="true" className="arrow arrow-e">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
