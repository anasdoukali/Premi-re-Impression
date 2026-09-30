"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { ArrowLink, buttonClass } from "@/components/ui/ArrowLink";
import { useSettings } from "@/components/SettingsProvider";

export function CheckoutView() {
  const { items, ready, clear } = useCart();
  const [sent, setSent] = useState(false);
  const paymentOn = useSettings().services.payment;

  if (!ready) return <p className="py-20 text-ink-soft">Chargement…</p>;

  if (items.length === 0 && !sent) {
    return (
      <div className="border-t border-line py-16">
        <p className="font-display text-4xl">Aucun article à commander.</p>
        <div className="mt-8">
          <ArrowLink href="/solutions">Découvrir les solutions</ArrowLink>
        </div>
      </div>
    );
  }

  const summary = items.map((i) => ({
    produit: i.name,
    options: i.selections.map((s) => `${s.label} : ${s.valueLabel}`),
    fichier:
      i.file.status === "selected"
        ? `${i.file.name} (non transmis)`
        : i.file.status === "not-ready"
          ? `Pas prêt${i.file.note ? ` — ${i.file.note}` : ""}`
          : null,
    accompagnement: i.assistance,
    precisions: i.notes || null,
  }));

  const initialMessage = items
    .map((i) => `• ${i.name} — ${i.selections.map((s) => s.valueLabel).join(", ")}`)
    .join("\n");

  return (
    <div className="grid gap-16 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {!paymentOn && (
          <div role="note" className="border border-espresso/30 bg-sand/60 p-6 sm:p-8">
            <p className="eyebrow">Mode démonstration</p>
            <p className="mt-3 font-display text-3xl leading-tight">Le paiement en ligne n’est pas encore connecté.</p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
              Aucune commande ne peut être payée ni finalisée sur ce site pour le moment. Vous pouvez en revanche nous envoyer
              votre sélection : nous vous confirmons prix et délai par email.
            </p>
          </div>
        )}

        <section aria-labelledby="send-title" className="mt-14">
          <h2 id="send-title" className="display display-sm">Envoyer ma sélection</h2>
          <div className="mt-8">
            <ProjectForm
              kind="cart"
              submitLabel="Envoyer ma sélection"
              hideProjectType
              hideFile
              details={{ articles: summary }}
              messageLabel="Votre sélection et vos précisions"
              initialMessage={initialMessage}
              onSuccess={() => {
                setSent(true);
                clear();
              }}
            />
          </div>
        </section>
      </div>

      <aside aria-labelledby="pay-title" className="lg:col-span-5">
        <div className="bg-espresso p-7 text-ivory on-dark lg:sticky lg:top-28">
          <h2 id="pay-title" className="eyebrow text-ivory/70">Récapitulatif</h2>
          {sent ? (
            <p className="mt-4 text-sm text-ivory/80">Votre sélection a été transmise en demande de devis.</p>
          ) : (
            <ul className="mt-5 divide-y divide-ivory/15 border-y border-ivory/15 text-sm">
              {items.map((i) => (
                <li key={i.id} className="py-3">
                  <p className="font-semibold">{i.name}</p>
                  <p className="mt-1 text-ivory/70">{i.selections.map((s) => s.valueLabel).join(" · ")}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex justify-between text-sm">
            <span className="text-ivory/70">Total</span>
            <span>Confirmé sur devis</span>
          </div>
          <button type="button" disabled aria-describedby="pay-note" className={`${buttonClass.solid} mt-8 w-full !bg-ivory !text-espresso`}>
            Payer ma commande
          </button>
          <p id="pay-note" className="mt-3 text-xs leading-relaxed text-ivory/70">
            {paymentOn ? "Paiement sécurisé." : "Indisponible : paiement en ligne non connecté (démonstration)."}
          </p>
        </div>
      </aside>
    </div>
  );
}
