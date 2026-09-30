"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "@/lib/use-in-view";

type Props = {
  lines: ReactNode[];
  as?: ElementType;
  size?: "xl" | "lg" | "md" | "sm";
  className?: string;
  delay?: number;
  id?: string;
};

/** Oversized display headline, revealed line by line through a mask. */
export function MaskedHeadline({ lines, as, size = "lg", className, delay = 0, id }: Props) {
  const Tag = (as ?? "h2") as ElementType;
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 });
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal="mask"
      className={["display", `display-${size}`, className, inView ? "is-visible" : ""].filter(Boolean).join(" ")}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <span style={{ "--i": i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
