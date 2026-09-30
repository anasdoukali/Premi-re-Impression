"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { categories, type Category, type Product } from "@/data/products";
import { ProductPreview } from "./ProductPreview";

type Filter = Category | "tout";

export function Catalogue({ initialFilter, products }: { initialFilter: Filter; products: Product[] }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const reduce = useReducedMotion();
  const list = filter === "tout" ? products : products.filter((p) => p.category === filter);

  function choose(f: Filter) {
    setFilter(f);
    const url = new URL(window.location.href);
    if (f === "tout") url.searchParams.delete("filtre");
    else url.searchParams.set("filtre", f);
    window.history.replaceState(null, "", url.toString());
  }

  return (
    <div>
      <div className="sticky top-[68px] md:top-[62px] z-30 -mx-5 border-y border-line bg-ivory/97 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div role="group" aria-label="Filtrer par catégorie" className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
          {categories.map((c) => {
            const active = filter === c.value;
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={active}
                onClick={() => choose(c.value)}
                className={`min-h-11 shrink-0 px-5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-400 ${
                  active ? "bg-espresso text-ivory" : "text-espresso hover:bg-sand"
                }`}
              >
                {c.label}
                <span className="ml-2 text-[0.65rem] opacity-60">
                  {c.value === "tout" ? products.length : products.filter((p) => p.category === c.value).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {list.length} produit{list.length > 1 ? "s" : ""} affiché{list.length > 1 ? "s" : ""}
      </p>

      <motion.ul layout={!reduce} className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p) => (
            <motion.li
              key={p.slug}
              layout={!reduce}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease: [0.2, 0.7, 0.1, 1] }}
            >
              <ProductPreview product={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
