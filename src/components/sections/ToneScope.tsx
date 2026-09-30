"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type Tone = "ivory" | "sand" | "espresso";

/**
 * Wraps several sections and smoothly transitions the background color
 * to the tone of the section crossing the middle of the viewport.
 * Children declare their tone with `data-tone-section="sand"`.
 */
export function ToneScope({ children, id, className = "" }: { children: ReactNode; id?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tone, setTone] = useState<Tone>("ivory");

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-tone-section]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setTone((e.target.getAttribute("data-tone-section") as Tone) ?? "ivory");
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} data-tone={tone} className={`tone-scope ${tone === "espresso" ? "on-dark" : ""} ${className}`}>
      {children}
    </div>
  );
}
