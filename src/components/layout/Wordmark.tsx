import Link from "next/link";

/** Typographic wordmark — placeholder until the final logo is supplied. */
export function Wordmark({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label="Première Impression — accueil"
      className={`group inline-flex flex-col leading-none ${tone === "light" ? "text-ivory" : "text-espresso"} ${className}`}
    >
      <span className="font-display text-[1.35rem] font-medium uppercase tracking-[0.08em] sm:text-[1.55rem]">
        Première <span className="serif-italic normal-case tracking-normal">Impression</span>
      </span>
      <span className="mt-1 text-[0.56rem] font-semibold uppercase tracking-[0.34em] opacity-70">
        Printing Solutions Store
      </span>
    </Link>
  );
}
