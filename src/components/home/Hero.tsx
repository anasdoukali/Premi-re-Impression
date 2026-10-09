import type { CSSProperties } from "react";
import Link from "next/link";
import { Picture, IntentCaption } from "@/components/ui/Picture";

const lines = ["Votre idée.", "Entre de", "bonnes mains."];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-sand">
      <div className="hero-image absolute inset-0">
        <Picture image="hero" sizes="100vw" priority />
      </div>
      {/* Soft ivory veil where the headline sits — preserves the photograph elsewhere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.55)_38%,rgba(255,255,255,0)_62%)] md:bg-[linear-gradient(100deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.6)_34%,rgba(255,255,255,0)_60%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,rgba(75,63,42,0.35),rgba(75,63,42,0))]" />

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-between px-5 pb-10 pt-32 sm:px-8 md:pb-14 md:pt-40 lg:px-12">
        <div>
          <h1 id="hero-title" className="display display-xl">
            {lines.map((line, i) => (
              <span key={line} className="hero-line mask-line">
                <span style={{ "--i": i } as CSSProperties}>{line}</span>
              </span>
            ))}
          </h1>
          <p
            className="hero-follow mt-7 max-w-md text-[1.05rem] leading-relaxed text-espresso/90 md:text-lg"
            style={{ "--delay": "1.05s" } as CSSProperties}
          >
            Imprimer, personnaliser, améliorer. Un même lieu pour donner forme à vos projets.
          </p>
          <div className="hero-follow mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6" style={{ "--delay": "1.25s" } as CSSProperties}>
            <Link
              href="/le-lieu#contact"
              className="inline-flex min-h-14 items-center justify-center gap-3 bg-espresso px-8 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors duration-500 hover:bg-olive-deep"
            >
              J’ai un projet <span aria-hidden="true" className="arrow arrow-ne">↗</span>
            </Link>
            <Link
              href="#solutions"
              className="inline-flex min-h-14 items-center justify-center gap-3 border border-espresso/60 bg-ivory/40 px-8 text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 hover:bg-ivory sm:border-transparent sm:bg-transparent sm:px-2 sm:hover:bg-transparent"
            >
              <span className="sm:border-b sm:border-espresso/50 sm:pb-1">Découvrir les solutions</span>
              <span aria-hidden="true" className="arrow arrow-s">↓</span>
            </Link>
          </div>
        </div>

        <div className="hero-follow flex items-end justify-between" style={{ "--delay": "1.6s" } as CSSProperties}>
          <a href="#rassurance" className="on-dark flex items-center gap-4 text-ivory" aria-label="Faire défiler vers la suite">
            <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-ivory/30">
              <span className="scroll-cue-line absolute inset-0 bg-ivory" />
            </span>
            <span className="eyebrow hidden sm:inline">Défiler</span>
          </a>
          <IntentCaption image="hero" />
        </div>
      </div>
    </section>
  );
}
