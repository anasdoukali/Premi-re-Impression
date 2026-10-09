import type { ReactNode } from "react";
import type { ImageKey } from "@/data/images";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { MaskedHeadline } from "@/components/motion/MaskedHeadline";
import { Reveal } from "@/components/motion/Reveal";
import { IntentCaption, Picture } from "@/components/ui/Picture";

type Props = {
  image: ImageKey;
  lines: ReactNode[];
  headingId: string;
  headingAs?: "h1" | "h2";
  text?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  priority?: boolean;
  /** Slow movement on scroll; the hero-type usage keeps the image still. */
  motion?: boolean;
};

/**
 * Immersive, full-screen image with ivory text anchored at the bottom over
 * a soft espresso gradient. Text stays stable; only the image moves.
 */
export function FullBleedSection({ image, lines, headingId, headingAs = "h2", text, actions, aside, priority, motion = true }: Props) {
  return (
    <section aria-labelledby={headingId} className="on-dark relative flex min-h-[100svh] flex-col overflow-hidden bg-espresso text-ivory">
      {motion ? (
        <ParallaxImage image={image} priority={priority} strength={5} zoom={0.1} />
      ) : (
        <div className="hero-image absolute inset-0">
          <Picture image={image} sizes="100vw" priority={priority} />
        </div>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(75,63,42,0.86)_0%,rgba(75,63,42,0.55)_38%,rgba(75,63,42,0.05)_68%,rgba(75,63,42,0)_100%)]"
      />
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-12 pt-32 sm:px-8 md:pb-16 lg:px-12">
        <MaskedHeadline as={headingAs} id={headingId} lines={lines} size="lg" />
        <div className="mt-7 grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            {text && (
              <Reveal as="p" delay={300} className="max-w-lg text-[1.05rem] leading-relaxed text-ivory/90 md:text-lg">
                {text}
              </Reveal>
            )}
            {actions && (
              <Reveal delay={450} className="mt-9">
                {actions}
              </Reveal>
            )}
          </div>
          {aside && <div className="md:col-span-5 lg:col-span-4 lg:col-start-9">{aside}</div>}
        </div>
        <IntentCaption image={image} className="mt-8 self-end" />
      </div>
    </section>
  );
}
