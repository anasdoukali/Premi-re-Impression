import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated, isDemoPassword } from "@/server/auth";
import { logoutAction } from "../actions";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/demandes", label: "Demandes" },
  { href: "/admin/catalogue", label: "Catalogue" },
  { href: "/admin/reglages", label: "Réglages" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-line bg-ivory">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-display text-xl uppercase tracking-[0.06em]">Première Impression</p>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-ink-soft">Administration</p>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
              Voir le site ↗
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
                Déconnexion
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Administration" className="mx-auto max-w-6xl px-5">
          <ul className="flex gap-1 overflow-x-auto">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] hover:border-espresso"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {isDemoPassword() && (
        <p className="bg-brand-brown px-5 py-2 text-center text-xs text-ivory">
          Mot de passe de démonstration actif — définissez ADMIN_PASSWORD et ADMIN_SESSION_SECRET avant la mise en ligne.
        </p>
      )}

      <main className="mx-auto max-w-6xl px-5 py-12">{children}</main>
    </div>
  );
}
