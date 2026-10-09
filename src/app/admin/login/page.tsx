import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated, isDemoPassword, demoPassword } from "@/server/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  const demo = isDemoPassword();

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-24">
      <p className="eyebrow text-ink-soft">Première Impression</p>
      <h1 className="display display-sm mt-4">Administration</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Espace réservé à l’équipe : demandes, catalogue et réglages du site.
      </p>
      <div className="mt-10">
        <LoginForm />
      </div>
      {demo && (
        <div className="mt-10 border border-brand-brown/40 bg-brand-brown/5 p-4 text-sm leading-relaxed text-ink-soft">
          <p className="font-semibold text-espresso">Mot de passe de démonstration actif</p>
          <p className="mt-2">
            Aucune variable <code className="font-mono text-xs">ADMIN_PASSWORD</code> n’est définie. Le mot de passe
            temporaire est <strong className="text-espresso">{demoPassword()}</strong>. Définissez{" "}
            <code className="font-mono text-xs">ADMIN_PASSWORD</code> et{" "}
            <code className="font-mono text-xs">ADMIN_SESSION_SECRET</code> avant toute mise en ligne.
          </p>
        </div>
      )}
    </div>
  );
}
