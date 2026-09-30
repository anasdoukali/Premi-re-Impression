"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adds visibility once (never hides again) — used for reveal animations.
 * Falls back to visible if IntersectionObserver is unavailable.
 */
export function useInView<T extends Element>(options?: { rootMargin?: string; threshold?: number }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const rootMargin = options?.rootMargin ?? "0px 0px -12% 0px";
  const threshold = options?.threshold ?? 0.15;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView };
}
