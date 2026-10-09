import Link from "next/link";
import Image from "next/image";

/** Original Première Impression brand asset. */
export function Wordmark({ className = "", tone = "dark", compact = false }: { className?: string; tone?: "dark" | "light"; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Première Impression — accueil"
      className={`group inline-flex shrink-0 items-center justify-center ${className}`}
    >
      <Image
        src="/logo-pis-or.png"
        width={1398}
        height={1297}
        unoptimized
        alt="Première Impression — Printing Solutions Boutique"
        priority={tone === "dark"}
        className={compact ? "block h-[82px] w-[88px] object-contain lg:h-[102px] lg:w-[110px]" : "block h-[76px] w-[80px] object-contain lg:h-[96px] lg:w-[101px]"}
      />
    </Link>
  );
}
