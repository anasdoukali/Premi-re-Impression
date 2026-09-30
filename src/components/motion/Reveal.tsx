"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "@/lib/use-in-view";

type RevealProps = {
  as?: ElementType;
  variant?: "fade" | "soft" | "image";
  delay?: number;
  className?: string;
  children: ReactNode;
  id?: string;
};

/** Scroll-triggered entrance. Content is fully visible without JavaScript. */
export function Reveal({ as, variant = "fade", delay = 0, className, children, id }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={variant}
      className={[className, inView ? "is-visible" : ""].filter(Boolean).join(" ")}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
