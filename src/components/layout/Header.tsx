"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/config/site";
import { useCart } from "@/components/cart/CartProvider";
import { Wordmark } from "./Wordmark";

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8h14l-1 12H6L5 8Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const { items, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const count = ready ? items.length : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-[60] bg-espresso px-4 py-3 text-sm text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-500 ${
          scrolled || open
            ? "border-b border-line/80 bg-ivory/97 py-3"
            : "border-b border-transparent bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Wordmark />

          <nav aria-label="Navigation principale" className="hidden items-center gap-10 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="nav-link text-[0.8rem] font-semibold uppercase tracking-[0.16em]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/le-lieu#contact"
              className="group inline-flex items-center gap-2 border border-espresso px-5 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 hover:bg-espresso hover:text-ivory"
            >
              Parlons de votre projet <span aria-hidden="true" className="arrow arrow-ne">↗</span>
            </Link>
            <Link
              href="/panier"
              aria-label={`Panier, ${count} ${count > 1 ? "articles" : "article"}`}
              aria-current={pathname === "/panier" ? "page" : undefined}
              className="relative inline-flex h-10 w-10 items-center justify-center"
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive-deep px-1 text-[0.6rem] font-bold text-ivory">
                  {count}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/panier"
              aria-label={`Panier, ${count} ${count > 1 ? "articles" : "article"}`}
              className="relative inline-flex h-11 w-11 items-center justify-center"
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive-deep px-1 text-[0.6rem] font-bold text-ivory">
                  {count}
                </span>
              )}
            </Link>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 items-center gap-2 px-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em]"
            >
              {open ? "Fermer" : "Menu"}
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span className={`absolute left-0 h-px w-5 bg-current transition-transform duration-500 ${open ? "top-1.5 rotate-45" : "top-0.5"}`} />
                <span className={`absolute left-0 h-px w-5 bg-current transition-transform duration-500 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ivory px-5 pb-10 pt-28 md:hidden"
          >
            <nav aria-label="Navigation mobile" className="flex flex-col gap-2">
              {[{ href: "/", label: "Accueil" }, ...navigation, { href: "/panier", label: "Panier" }].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.05, duration: 0.6, ease: [0.2, 0.7, 0.1, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="display block py-1 text-[3rem]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <Link
              href="/le-lieu#contact"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-14 items-center justify-center gap-3 bg-espresso px-6 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-ivory"
            >
              Parlons de votre projet <span aria-hidden="true">↗</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
