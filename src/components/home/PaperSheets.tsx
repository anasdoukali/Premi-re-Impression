"use client";

import type { CSSProperties } from "react";
import { useInView } from "@/lib/use-in-view";

type Sheet = {
  className: string;
  tx: string;
  ty: string;
  rot: string;
  order: number;
};

/**
 * Signature animation: layered sheets start misaligned (the unfinished project)
 * and settle into a clean, printed composition.
 */
const sheets: Sheet[] = [
  { className: "inset-0 bg-sand", tx: "-6%", ty: "4%", rot: "-4deg", order: 0 },
  { className: "inset-[5%] bg-ivory shadow-[0_30px_60px_-30px_rgba(40,35,31,0.35)]", tx: "7%", ty: "-3%", rot: "5deg", order: 1 },
  { className: "left-[12%] right-[12%] top-[12%] h-[38%] bg-olive", tx: "-14%", ty: "9%", rot: "-6deg", order: 2 },
  { className: "left-[12%] top-[56%] h-[5.5%] w-[62%] bg-espresso", tx: "18%", ty: "-12%", rot: "3deg", order: 3 },
  { className: "left-[12%] top-[64%] h-[5.5%] w-[44%] bg-espresso", tx: "-10%", ty: "14%", rot: "-4deg", order: 4 },
  { className: "left-[12%] top-[76%] h-[1.4%] w-[70%] bg-taupe", tx: "8%", ty: "10%", rot: "2deg", order: 5 },
  { className: "left-[12%] top-[80%] h-[1.4%] w-[58%] bg-taupe", tx: "-12%", ty: "6%", rot: "-3deg", order: 5 },
  { className: "left-[12%] top-[84%] h-[1.4%] w-[64%] bg-taupe", tx: "5%", ty: "12%", rot: "4deg", order: 6 },
  { className: "right-[12%] top-[56%] h-[13%] aspect-square rounded-full border border-espresso/60", tx: "-40%", ty: "30%", rot: "0deg", order: 6 },
];

export function PaperSheets() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.45, rootMargin: "0px" });

  return (
    <figure ref={ref} className={`sheets w-full ${inView ? "is-visible" : ""}`}>
      <div
        className="relative mx-auto aspect-[4/5] w-full max-w-[420px]"
        role="img"
        aria-label="Illustration : des feuilles désalignées s’ajustent pour former une composition imprimée nette."
      >
        {sheets.map((s, i) => (
          <div
            key={i}
            className={`sheet absolute ${s.className}`}
            style={{ "--tx": s.tx, "--ty": s.ty, "--rot": s.rot, "--order": s.order } as CSSProperties}
          />
        ))}
        {/* Crop marks appear once the composition is aligned */}
        {[
          "left-[-14px] top-[5%] w-[10px] border-t",
          "left-[5%] top-[-14px] h-[10px] border-l",
          "right-[-14px] top-[5%] w-[10px] border-t",
          "right-[5%] top-[-14px] h-[10px] border-l",
          "left-[-14px] bottom-[5%] w-[10px] border-t",
          "left-[5%] bottom-[-14px] h-[10px] border-l",
          "right-[-14px] bottom-[5%] w-[10px] border-t",
          "right-[5%] bottom-[-14px] h-[10px] border-l",
        ].map((c) => (
          <span key={c} aria-hidden="true" className={`crop-mark absolute border-espresso/70 ${c}`} />
        ))}
      </div>
      <figcaption className="relative mt-8 h-5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ink-soft">
        <span aria-hidden="true" className="sheets-label sheets-label-draft absolute inset-0">
          Brouillon
        </span>
        <span className="sheets-label sheets-label-done absolute inset-0">Prêt à imprimer</span>
      </figcaption>
    </figure>
  );
}
