import Link from "next/link";
import type { ReactNode } from "react";
import type { ImageKey } from "@/data/images";
import { MaskedHeadline } from "@/components/motion/MaskedHeadline";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { IntentCaption } from "@/components/ui/Picture";
import type { Tone } from "./ToneScope";

type Props = {
  index: string;
  label: string;
  lines: ReactNode[];
  description: string;
  cta: string;
  href: string;
  image: ImageKey;
  layout: "full" | "split-left" | "split-right";
  tone: Tone;
};

function ChapterCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-12 items-center gap-3 border-b border-current pb-1 text-[0.82rem] font-semibold uppercase tracking-[0.14em]"
    >
      {children} <span aria-hidden="true" className="arrow arrow-ne text-base">↗</span>
    </Link>
  );
}

function Label({ index, label }: { index: string; label: string }) {
  return (
    <Reveal as="p" className="eyebrow flex items-center gap-4 text-[var(--fg-soft)]">
      <span>{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-current" />
      <span>{label}</span>
    </Reveal>
  );
}

/** Large, image-led solution chapter. Alternates full-bleed and split compositions. */
export function SolutionChapter({ index, label, lines, description, cta, href, image, layout, tone }: Props) {
  const headingId = `chapitre-${index}`;

  if (layout === "full") {
    return (
      <section data-tone-section={tone} aria-labelledby={headingId} className="py-20 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <Label index={index} label={label} />
        </div>
        <div className="relative mt-10 h-[78svh] min-h-[460px] md:mt-14 md:h-[88vh]">
          <ParallaxImage image={image} sizes="100vw" />
          <IntentCaption image={image} className="absolute bottom-4 right-5 sm:right-8 lg:right-12" />
        </div>
        <div className="mx-auto mt-12 grid max-w-[1600px] gap-10 px-5 sm:px-8 md:mt-16 md:grid-cols-12 lg:px-12">
          <MaskedHeadline id={headingId} lines={lines} size="lg" className="md:col-span-8" />
          <Reveal className="flex flex-col justify-end gap-8 md:col-span-4" delay={250}>
            <p className="max-w-sm text-lg leading-relaxed text-[var(--fg-soft)]">{description}</p>
            <div><ChapterCta href={href}>{cta}</ChapterCta></div>
          </Reveal>
        </div>
      </section>
    );
  }

  const imageFirst = layout === "split-left";
  return (
    <section data-tone-section={tone} aria-labelledby={headingId} className="py-20 md:py-32">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-12">
        <div
          className={`relative aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-auto md:h-[88vh] ${
            imageFirst ? "md:order-1" : "md:order-2"
          }`}
        >
          <ParallaxImage image={image} sizes="(min-width: 768px) 58vw, 100vw" strength={6} />
          <IntentCaption image={image} className="absolute bottom-4 right-4" />
        </div>
        <div
          className={`flex flex-col gap-10 md:col-span-5 ${
            imageFirst ? "md:order-2 md:pl-10 lg:pl-16" : "md:order-1 md:pr-10 lg:pr-16"
          }`}
        >
          <Label index={index} label={label} />
          <MaskedHeadline id={headingId} lines={lines} size="md" />
          <Reveal className="flex flex-col gap-8" delay={250}>
            <p className="max-w-sm text-lg leading-relaxed text-[var(--fg-soft)]">{description}</p>
            <div><ChapterCta href={href}>{cta}</ChapterCta></div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
