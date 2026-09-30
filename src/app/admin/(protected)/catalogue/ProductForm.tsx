"use client";

import Link from "next/link";
import { deleteProduct, saveProductAction } from "../../actions";
import { Feedback, Label, SubmitButton, adminInput, useAdminAction } from "../../AdminUI";
import type { ProductRow } from "@/db/schema";

const categories = [
  { value: "print", label: "Print" },
  { value: "textile", label: "Textile" },
  { value: "objets", label: "Objets" },
  { value: "signaletique", label: "Signalétique" },
];

export function ProductForm({ product, imageKeys }: { product?: ProductRow; imageKeys: string[] }) {
  const [state, action, pending] = useAdminAction(saveProductAction);
  const p = product;

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-8">
        {p && <input type="hidden" name="id" value={p.id} />}

        <section className="border border-line bg-ivory p-6">
          <h2 className="font-display text-xl">Identité</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Nom</Label>
              <input id="name" name="name" required defaultValue={p?.name} className={adminInput} />
            </div>
            <div>
              <Label htmlFor="slug" hint="url : /solutions/…">Identifiant</Label>
              <input id="slug" name="slug" required defaultValue={p?.slug} className={adminInput} />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <select id="category" name="category" defaultValue={p?.category ?? "print"} className={adminInput}>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="kind" hint="standard = panier, sur mesure = devis">Parcours</Label>
              <select id="kind" name="kind" defaultValue={p?.kind ?? "standard"} className={adminInput}>
                <option value="standard">Produit standard</option>
                <option value="custom">Projet sur mesure</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="tagline">Accroche</Label>
              <input id="tagline" name="tagline" defaultValue={p?.tagline} className={adminInput} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea id="description" name="description" rows={3} defaultValue={p?.description} className={adminInput} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="customization" hint="séparées par des virgules">Personnalisations affichées</Label>
              <input
                id="customization"
                name="customization"
                defaultValue={(p?.customization ?? []).join(", ")}
                className={adminInput}
              />
            </div>
          </div>
        </section>

        <section className="border border-line bg-ivory p-6">
          <h2 className="font-display text-xl">Visuels</h2>
          <p className="mt-2 text-xs text-ink-soft">
            Choisissez parmi les visuels du site. Pour ajouter une photo, déposez-la dans <code>public/images/</code> et
            déclarez-la dans <code>src/data/images.ts</code>.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="imagePrimary">Visuel principal</Label>
              <select id="imagePrimary" name="imagePrimary" defaultValue={p?.imagePrimary ?? "paper"} className={adminInput}>
                {imageKeys.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="imageSecondary" hint="au survol">Visuel secondaire</Label>
              <select id="imageSecondary" name="imageSecondary" defaultValue={p?.imageSecondary ?? "design"} className={adminInput}>
                {imageKeys.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="border border-line bg-ivory p-6">
          <h2 className="font-display text-xl">Prix & visibilité</h2>
          <p className="mt-2 text-xs text-ink-soft">
            Laissez le prix vide tant qu’aucun tarif n’est confirmé : le site affiche alors « Configurer » ou « Demander un
            devis », jamais un prix inventé.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="priceFrom" hint="en euros">Prix à partir de</Label>
              <input
                id="priceFrom"
                name="priceFrom"
                inputMode="decimal"
                defaultValue={p?.priceFromCents != null ? (p.priceFromCents / 100).toString() : ""}
                className={adminInput}
              />
            </div>
            <div>
              <Label htmlFor="priceUnit" hint="ex. les 100">Unité</Label>
              <input id="priceUnit" name="priceUnit" defaultValue={p?.priceUnit} className={adminInput} />
            </div>
            <div>
              <Label htmlFor="position">Ordre d’affichage</Label>
              <input id="position" name="position" type="number" defaultValue={p?.position ?? 0} className={adminInput} />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="published" defaultChecked={p?.published ?? true} className="h-4 w-4 accent-espresso" />
              Publié
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} className="h-4 w-4 accent-espresso" />
              Mis en avant
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="express" defaultChecked={p?.express ?? false} className="h-4 w-4 accent-espresso" />
              Éligible express
            </label>
          </div>
        </section>

        <section className="border border-line bg-ivory p-6">
          <h2 className="font-display text-xl">Options de configuration</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft">
            Format JSON : un tableau de groupes{" "}
            <code>{`{ "id", "label", "display": "pills|list|swatches", "choices": [{ "value", "label", "hint?", "swatch?" }] }`}</code>.
            Les groupes invalides sont ignorés à l’enregistrement.
          </p>
          <Label htmlFor="options">Options</Label>
          <textarea
            id="options"
            name="options"
            rows={16}
            spellCheck={false}
            defaultValue={JSON.stringify(p?.options ?? [], null, 2)}
            className={`${adminInput} font-mono text-xs`}
          />
        </section>

        <Feedback state={state} />
        <div className="flex flex-wrap items-center gap-6">
          <SubmitButton pending={pending}>Enregistrer</SubmitButton>
          <Link href="/admin/catalogue" className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
            Retour au catalogue
          </Link>
        </div>
      </form>

      {p && (
        <form
          action={deleteProduct}
          onSubmit={(e) => {
            if (!confirm(`Supprimer « ${p.name} » ?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={p.id} />
          <button type="submit" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c3b2b] underline underline-offset-4">
            Supprimer ce produit
          </button>
        </form>
      )}
    </div>
  );
}
