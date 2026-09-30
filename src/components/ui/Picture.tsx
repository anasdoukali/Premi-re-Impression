import Image from "next/image";
import type { CSSProperties } from "react";
import { images, type ImageKey } from "@/data/images";

type Props = {
  image: ImageKey;
  sizes: string;
  priority?: boolean;
  className?: string;
  alt?: string;
  decorative?: boolean;
};

/** Fill image with intentional mobile (portrait) and desktop (landscape) focal points. */
export function Picture({ image, sizes, priority, className = "", alt, decorative }: Props) {
  const img = images[image];
  return (
    <Image
      src={img.src}
      alt={decorative ? "" : (alt ?? img.alt)}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      className={`focal object-cover ${className}`}
      style={{ "--pos-m": img.focus.mobile, "--pos-d": img.focus.desktop } as CSSProperties}
    />
  );
}

export function IntentCaption({ image, tone = "light", className = "" }: { image: ImageKey; tone?: "light" | "dark"; className?: string }) {
  if (!images[image].intent) return null;
  return (
    <p
      className={`pointer-events-none text-[0.66rem] font-medium uppercase tracking-[0.2em] ${
        tone === "light" ? "text-ivory/85" : "text-espresso/75"
      } ${className}`}
    >
      Visuel d’intention
    </p>
  );
}
