"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ImageKey } from "@/data/images";
import { Picture } from "@/components/ui/Picture";

/**
 * Large image with a slow zoom-out and subtle parallax as it crosses the viewport.
 * Parallax is reduced on small screens and disabled for reduced-motion users.
 */
export function ParallaxImage({
  image,
  sizes = "100vw",
  priority,
  strength = 8,
  zoom = 0.08,
  className = "",
}: {
  image: ImageKey;
  sizes?: string;
  priority?: boolean;
  strength?: number;
  zoom?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const s = reduce ? 0 : small ? strength * 0.35 : strength;
  const z = reduce ? 0 : zoom;
  const y = useTransform(scrollYProgress, [0, 1], [`-${s}%`, `${s}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1 + z + s / 100, 1 + s / 100 + 0.01, 1 + s / 100 + 0.01]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Picture image={image} sizes={sizes} priority={priority} />
      </motion.div>
    </div>
  );
}
