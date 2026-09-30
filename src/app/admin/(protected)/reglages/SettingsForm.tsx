"use client";

import { saveSettingsAction } from "../../actions";
import { Feedback, Label, SubmitButton, adminInput, useAdminAction } from "../../AdminUI";
import type { AppSettings } from "@/config/site";

const HOUR_ROWS = 7;

export function SettingsForm({ settings }: { settings: AppSettings }) {
  const [state, action, pending] = useAdminAction(saveSettingsAction);
  const hours = [...settings.hours, ...Array.from({ length: HOUR_ROWS }, () => ({ days: "", hours: "" }))].slice(
    0,
    HOUR_ROWS,
  );

  return (
    <form action={action} className="space-y-8">
      <section className="border border-line bg-ivory p-6">
        <h2 className="font-display text-xl">Coordonnées</h2>
        <p className="mt-2 text-xs text-ink-soft">
          Chaque champ laissé vide reste masqué sur le site : rien n’est inventé.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <input id="address" name="address" defaultValue={settings.contact.address ?? ""} className={adminInput} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="mapUrl" hint="https://…">Lien vers le plan</Label>
            <input id="mapUrl" name="mapUrl" type="url" defaultValue={settings.contact.mapUrl ?? ""} className={adminInput} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <input id="email" name="email" type="email" defaultValue={settings.contact.email ?? ""} className={adminInput} />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <input id="phone" name="phone" defaultValue={settings.contact.phone ?? ""} className={adminInput} />
          </div>
          <div>
            <Label htmlFor="whatsapp" hint="chiffres uniquement, ex. 33612345678">WhatsApp</Label>
            <input id="whatsapp" name="whatsapp" defaultValue={settings.contact.whatsapp ?? ""} className={adminInput} />
          </div>
        </div>
      </section>

      <section className="border border-line bg-ivory p-6">
        <h2 className="font-display text-xl">Horaires</h2>
        <p className="mt-2 text-xs text-ink-soft">Les lignes vides sont ignorées. Aucun horaire = section masquée.</p>
        <div className="mt-5 space-y-3">
          {hours.map((h, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor={`hours-days-${i}`}>Jours {i + 1}</Label>
                <input
                  id={`hours-days-${i}`}
                  name={`hours-days-${i}`}
                  placeholder="Lundi — Vendredi"
                  defaultValue={h.days}
                  className={adminInput}
                />
              </div>
              <div>
                <Label htmlFor={`hours-value-${i}`}>Horaires {i + 1}</Label>
                <input
                  id={`hours-value-${i}`}
                  name={`hours-value-${i}`}
                  placeholder="9 h — 19 h"
                  defaultValue={h.hours}
                  className={adminInput}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-line bg-ivory p-6">
        <h2 className="font-display text-xl">Services connectés</h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">
          N’activez ces options qu’une fois les intégrations réellement branchées. Tant qu’elles sont désactivées, le site
          l’annonce clairement aux clients (mode démonstration, fichiers non transmis).
        </p>
        <div className="mt-5 space-y-4 text-sm">
          <label className="flex items-start gap-3">
            <input type="checkbox" name="payment" defaultChecked={settings.services.payment} className="mt-1 h-4 w-4 accent-espresso" />
            <span>
              <span className="block font-semibold">Paiement en ligne connecté</span>
              <span className="text-ink-soft">Active le bouton de paiement dans le tunnel de commande.</span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" name="fileUpload" defaultChecked={settings.services.fileUpload} className="mt-1 h-4 w-4 accent-espresso" />
            <span>
              <span className="block font-semibold">Transfert de fichiers connecté</span>
              <span className="text-ink-soft">Retire les avertissements « fichier non transmis ».</span>
            </span>
          </label>
          <div className="max-w-xs">
            <Label htmlFor="maxFileSizeMb">Taille maximale annoncée (Mo)</Label>
            <input
              id="maxFileSizeMb"
              name="maxFileSizeMb"
              type="number"
              min={1}
              max={2000}
              defaultValue={settings.maxFileSizeMb}
              className={adminInput}
            />
          </div>
        </div>
      </section>

      <Feedback state={state} />
      <SubmitButton pending={pending}>Enregistrer les réglages</SubmitButton>
    </form>
  );
}
