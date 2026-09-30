import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "text" | "solid-light" | "outline-light" | "text-light";
type Arrow = "ne" | "s" | "e" | "none";

const arrows: Record<Exclude<Arrow, "none">, string> = { ne: "↗", s: "↓", e: "→" };

const styles: Record<Variant, string> = {
  solid:
    "bg-espresso text-ivory hover:bg-olive-deep px-7 py-4 min-h-12 border border-espresso hover:border-olive-deep",
  outline: "border border-espresso/70 text-espresso hover:bg-espresso hover:text-ivory px-7 py-4 min-h-12",
  text: "text-espresso py-2 border-b border-espresso/40 hover:border-espresso",
  "solid-light": "on-dark bg-ivory text-espresso hover:bg-sand px-7 py-4 min-h-12 border border-ivory",
  "outline-light": "on-dark border border-ivory/70 text-ivory hover:bg-ivory hover:text-espresso px-7 py-4 min-h-12",
  "text-light": "on-dark text-ivory py-2 border-b border-ivory/50 hover:border-ivory",
};

export function ArrowLink({
  href,
  children,
  variant = "solid",
  arrow = "ne",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: Arrow;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-3 text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      {arrow !== "none" && (
        <span aria-hidden="true" className={`arrow arrow-${arrow} text-base leading-none`}>
          {arrows[arrow]}
        </span>
      )}
    </Link>
  );
}

export const buttonClass = {
  solid:
    "inline-flex items-center justify-center gap-3 text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 bg-espresso text-ivory hover:bg-olive-deep px-7 py-4 min-h-12 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-espresso",
  outline:
    "inline-flex items-center justify-center gap-3 text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 border border-espresso/70 text-espresso hover:bg-espresso hover:text-ivory px-7 py-4 min-h-12 disabled:opacity-40 disabled:cursor-not-allowed",
};
