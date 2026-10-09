"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/config/site";
import { useCart } from "@/components/cart/CartProvider";
import { Wordmark } from "./Wordmark";

function NavIcon({ kind }: { kind: string }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "/" ? <><path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9" /></> : kind === "/panier" ? <><path d="M5 8h14l-1 13H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2" /></> : kind === "/solutions" ? <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></> : <><path d="M4 21V5l8-3 8 3v16M9 21v-7h6v7M8 7h1m6 0h1M8 10h1m6 0h1" /></>}
  </svg>;
}

export function Header() {
  const pathname = usePathname();
  const { items, ready } = useCart();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const count = ready ? items.length : 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const trigger = menuButton.current;
    const previousOverflow = document.body.style.overflow;
    const surfaces = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const previousInert = surfaces.map((el) => el.inert);
    surfaces.forEach((el) => { el.inert = true; });
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const controls = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      surfaces.forEach((el, index) => { el.inert = previousInert[index]; });
      trigger?.focus();
    };
  }, [open]);

  const links = [{ href: "/", label: "Accueil" }, ...navigation, { href: "/panier", label: "Panier" }];
  const transition = { duration: reducedMotion ? 0 : 0.4, ease: [0.2, 0.7, 0.1, 1] as [number, number, number, number] };

  return <>
    <a href="#contenu" className="sr-only z-[90] bg-espresso px-4 py-3 text-sm text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Aller au contenu</a>
    <header className="site-navigation" data-open={open}>
      <div className={`nav-launcher fixed left-5 top-5 z-[70] flex items-center sm:left-8 sm:top-6 ${open ? "invisible" : ""}`}>
        <Wordmark compact className="relative z-10" />
        <button ref={menuButton} type="button" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="site-sidebar" onClick={() => setOpen(true)} className="-ml-5 flex h-12 w-20 items-center justify-end rounded-r-2xl border border-espresso/20 bg-white/95 pr-5 text-espresso shadow-sm transition-colors hover:bg-brand-gold">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
      </div>
      <AnimatePresence>
        {open && <>
          <motion.div aria-hidden="true" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition} className="fixed inset-0 z-[75] bg-black/15 backdrop-blur-[2px]" />
          <motion.div ref={panelRef} id="site-sidebar" role="dialog" aria-modal="true" aria-label="Navigation" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={transition} className="fixed inset-y-0 left-0 z-[80] flex w-[min(320px,calc(100vw-64px))] flex-col border-r border-line bg-white text-black shadow-xl">
            <Wordmark compact className="absolute right-0 top-5 translate-x-1/2 sm:top-6" />
            <button ref={closeButton} type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)} className="ml-6 mt-7 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-brand-gold/20 sm:ml-8">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
            </button>
            <nav aria-label="Navigation principale" className="mt-16 flex-1 space-y-3 overflow-y-auto px-6 sm:px-8">
              {links.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-14 items-center gap-4 rounded-xl px-4 text-base transition-colors hover:bg-brand-gold/20 ${active ? "bg-brand-gold/25 font-semibold" : ""}`}>
                  <NavIcon kind={item.href} /><span>{item.label}</span>
                  {item.href === "/panier" && count > 0 && <span className="ml-auto rounded-full bg-brand-gold px-2 py-0.5 text-xs">{count}</span>}
                </Link>;
              })}
            </nav>
            <div className="px-6 pb-8 pt-6 sm:px-8">
              <Link href="/le-lieu#contact" onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-brand-gold px-4 text-sm font-semibold transition-colors hover:bg-brand-gold/80">Parlons de votre projet <span aria-hidden="true">↗</span></Link>
            </div>
          </motion.div>
        </>}
      </AnimatePresence>
    </header>
  </>;
}
