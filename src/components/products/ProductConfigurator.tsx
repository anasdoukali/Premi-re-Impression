"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import type { OptionGroup, Product } from "@/data/products";
import { configurationPrice, money } from "@/data/pricing";
import { useSettings } from "@/components/SettingsProvider";
import { useCart, type CartSelection } from "@/components/cart/CartProvider";
import { FileField, formatBytes, type PickedFile } from "@/components/forms/FileField";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { buttonClass } from "@/components/ui/ArrowLink";

function OptionFieldset({
  group,
  value,
  onChange,
  step,
  adjustments,
}: {
  group: OptionGroup;
  value: string;
  onChange: (v: string) => void;
  step: number;
  adjustments: (number | null)[];
}) {
  const name = `opt-${group.id}`;
  const display = group.display ?? "pills";
  const current = group.choices.find((c) => c.value === value);

  return (
    <fieldset className="border-t border-line pt-7">
      <legend className="flex w-full items-baseline justify-between gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
        <span>
          <span className="mr-3 text-ink-soft">{String(step).padStart(2, "0")}</span>
          {group.label}
        </span>
        {display === "swatches" && current && (
          <span className="font-normal normal-case tracking-normal text-ink-soft">{current.label}</span>
        )}
      </legend>

      <div className={`mt-5 ${display === "list" ? "grid gap-2" : "flex flex-wrap gap-2.5"}`}>
        {group.choices.map((c, index) => (
          <label key={c.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={c.value}
              checked={value === c.value}
              onChange={() => onChange(c.value)}
              className="peer sr-only"
              aria-label={display === "swatches" ? c.label : undefined}
            />
            {display === "swatches" ? (
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-transparent transition-colors peer-checked:border-espresso peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-olive-deep">
                <span className="h-9 w-9 rounded-full border border-espresso/15" style={{ background: c.swatch }} />
              </span>
            ) : display === "list" ? (
              <span className="flex min-h-14 items-center justify-between gap-4 border border-line px-5 py-3 transition-colors duration-300 hover:border-espresso/60 peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-olive-deep">
                <span className="font-medium">{c.label}</span>
                {adjustments[index] != null && <span className="text-xs opacity-75">{adjustments[index] === 0 ? "Inclus" : `${adjustments[index]! > 0 ? "+" : "−"} ${money(Math.abs(adjustments[index]!))}`}</span>}
                {c.hint && <span className="text-xs opacity-75">{c.hint}</span>}
              </span>
            ) : (
              <span className="inline-flex min-h-12 min-w-12 flex-col items-center justify-center border border-line px-4 py-2 text-sm transition-colors duration-300 hover:border-espresso/60 peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-olive-deep">
                <span className="font-medium">{c.label}</span>
                {adjustments[index] != null && <span className="text-xs opacity-75">{adjustments[index] === 0 ? "Inclus" : `${adjustments[index]! > 0 ? "+" : "−"} ${money(Math.abs(adjustments[index]!))}`}</span>}
                {c.hint && <span className="text-[0.65rem] uppercase tracking-[0.12em] opacity-70">{c.hint}</span>}
              </span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ProductConfigurator({ product }: { product: Product }) {
  const { add } = useCart();
  const settings = useSettings();
  const [choices, setChoices] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((g) => [g.id, g.choices[0]?.value ?? ""])),
  );
  const [fileMode, setFileMode] = useState<"ready" | "not-ready" | null>(null);
  const [file, setFile] = useState<PickedFile>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const [todo, setTodo] = useState("");
  const [assistance, setAssistance] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [priceBarVisible, setPriceBarVisible] = useState(false);
  const price = configurationPrice(product, choices, assistance);

  useEffect(() => {
    const update = () => setPriceBarVisible(window.scrollY > 100);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const confirmRef = useRef<HTMLDivElement>(null);
  const fileFieldsetRef = useRef<HTMLFieldSetElement>(null);

  const selections: CartSelection[] = useMemo(
    () =>
      product.options.map((g) => {
        const c = g.choices.find((x) => x.value === choices[g.id]);
        return { groupId: g.id, label: g.label, value: choices[g.id], valueLabel: c?.label ?? "—" };
      }),
    [product.options, choices],
  );

  const fileSummary =
    fileMode === "ready"
      ? file
        ? `${file.name} (${formatBytes(file.size)})${settings.services.fileUpload ? "" : " — non transmis"}`
        : "Fichier à sélectionner"
      : fileMode === "not-ready"
        ? "Fichier pas encore prêt"
        : "À préciser";

  function validateFile(): string | null {
    if (!fileMode) return "Indiquez si votre fichier est prêt, ou choisissez « Mon fichier n’est pas prêt ».";
    if (fileMode === "ready" && !file) return "Sélectionnez votre fichier, ou choisissez « Mon fichier n’est pas prêt ».";
    return null;
  }

  function handleAdd() {
    const err = validateFile();
    setError(err);
    if (err) {
      fileFieldsetRef.current?.focus();
      return;
    }
    add({
      slug: product.slug,
      name: product.name,
      pricing: price ?? undefined,
      selections,
      file:
        fileMode === "ready" && file
          ? { status: "selected", name: file.name, size: file.size }
          : { status: "not-ready", note: todo.trim() },
      assistance,
      notes: notes.trim(),
    });
    setAdded(true);
    requestAnimationFrame(() => confirmRef.current?.focus());
  }

  const isCustom = product.kind === "custom";
  let step = 0;

  return (
    <div>
      {priceBarVisible && createPortal(
        <section aria-label="Prix et disponibilité du produit" data-active="true" className="product-price-bar">
          <div className="border-b border-line">
            <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 lg:px-16 flex min-h-[74px] items-center justify-between gap-5 py-3">
              <Link href={`/solutions/${product.slug}`} className="text-sm font-semibold tracking-tight sm:text-xl">{product.name}</Link>
              <div className="text-right leading-normal">
                <p className="text-sm font-semibold tabular-nums sm:text-lg">{price ? `Total ${money(price.total, price.currency)}` : "Tarif sur devis"}</p>
                <p className="mt-0.5 text-xs sm:text-sm">{price?.preview ? "Prix indicatif · à confirmer" : "Votre configuration"}</p>
              </div>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 lg:px-16 flex min-h-[50px] flex-wrap items-center justify-end gap-x-5 gap-y-2 py-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9M12 3v5l4 2M12 3l5 2" /></svg>
              {product.express ? "Express selon le projet" : "Délai à confirmer"}
            </span>
            <span className="inline-flex items-center gap-2 font-semibold">
              <svg width="24" height="22" viewBox="0 0 26 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M2 5h14v13H2zM16 10h4l4 5v3h-8" /><circle cx="7" cy="19" r="2.5" fill="white" /><circle cx="20" cy="19" r="2.5" fill="white" /></svg>
              Fabrication à la demande
            </span>
            <span className="hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
              Retrait à la boutique
            </span>
          </div>
        </section>, document.body,
      )}
      <div className="mb-8 border-t border-line pt-6" aria-live="polite" aria-atomic="true">
        <p className="text-2xl font-semibold tabular-nums">{price ? money(price.total, price.currency) : "Sur devis"}</p>
        <p className="mt-2 text-xs text-ink-soft">{price?.preview ? "Prix de démonstration — tarif PIS à confirmer." : "Prix de votre configuration."}</p>
      </div>
      <div className="space-y-8">
        {product.options.map((g) => (
          <OptionFieldset
            key={g.id}
            group={g}
            adjustments={g.choices.map((c) => {
              const candidate = configurationPrice(product, { ...choices, [g.id]: c.value }, assistance);
              const base = configurationPrice(product, { ...choices, [g.id]: g.choices[0].value }, assistance);
              return candidate && base ? Math.round((candidate.total - base.total) * 100) / 100 : null;
            })}
            step={++step}
            value={choices[g.id]}
            onChange={(v) => {
              setChoices((s) => ({ ...s, [g.id]: v }));
              setAdded(false);
            }}
          />
        ))}

        {/* File */}
        <fieldset ref={fileFieldsetRef} tabIndex={-1} className="border-t border-line pt-7 outline-none">
          <legend className="text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
            <span className="mr-3 text-ink-soft">{String(++step).padStart(2, "0")}</span>Votre fichier
          </legend>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {[
              { v: "ready" as const, label: "J’ai un fichier prêt", hint: "PDF, AI, SVG, image…" },
              { v: "not-ready" as const, label: "Mon fichier n’est pas prêt.", hint: "On vous accompagne" },
            ].map((o) => (
              <label key={o.v} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="file-mode"
                  className="peer sr-only"
                  checked={fileMode === o.v}
                  onChange={() => {
                    setFileMode(o.v);
                    setError(null);
                    setAdded(false);
                  }}
                />
                <span className="flex min-h-16 flex-col justify-center border border-line px-5 py-3 transition-colors duration-300 hover:border-espresso/60 peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-olive-deep">
                  <span className="font-medium">{o.label}</span>
                  <span className="text-xs opacity-75">{o.hint}</span>
                </span>
              </label>
            ))}
          </div>

          {fileMode === "ready" && (
            <div className="mt-6">
              <FileField label="Votre fichier" optional={false} value={file} onChange={(f) => { setFile(f); setAdded(false); }} error={fileError} onError={setFileError} />
            </div>
          )}
          {fileMode === "not-ready" && (
            <div className="mt-6 space-y-6 bg-sand/45 p-5 sm:p-6">
              <p className="font-display text-2xl leading-snug">
                Vous pouvez nous transmettre vos éléments et préciser ce qu’il reste à faire.
              </p>
              <div>
                <label htmlFor="todo" className="block text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
                  Ce qu’il reste à faire <span className="font-normal normal-case tracking-normal text-ink-soft">— facultatif</span>
                </label>
                <textarea
                  id="todo"
                  className="field-input"
                  rows={3}
                  placeholder="ex. j’ai un logo en basse définition, il faut mettre en page le verso…"
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                />
              </div>
              <FileField label="Vos éléments (logo, textes, photos)" value={file} onChange={setFile} error={fileError} onError={setFileError} />
            </div>
          )}
        </fieldset>

        {/* Assistance */}
        <div className="border-t border-line pt-7">
          <label className="flex cursor-pointer items-start gap-4">
            <input
              type="checkbox"
              checked={assistance}
              onChange={(e) => { setAssistance(e.target.checked); setAdded(false); }}
              className="mt-1 h-5 w-5 shrink-0 accent-espresso"
            />
            <span>
              <span className="block font-medium">Je souhaite un accompagnement graphique{price?.preview ? " (+45 MAD)" : ""}</span>
              <span className="mt-1 block text-sm text-ink-soft">Mise en page, correction ou amélioration de votre fichier, avant impression.</span>
            </span>
          </label>
        </div>

        {!isCustom && (
          <div className="border-t border-line pt-7">
            <label htmlFor="notes" className="block text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
              Précisions <span className="font-normal normal-case tracking-normal text-ink-soft">— facultatif</span>
            </label>
            <textarea id="notes" className="field-input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Répartition des tailles, couleur Pantone, délai…" />
          </div>
        )}
      </div>

      {/* Summary */}
      <section aria-labelledby="recap-title" className="mt-12 bg-espresso p-6 text-ivory on-dark sm:p-8">
        <h2 id="recap-title" className="eyebrow text-ivory/70">Récapitulatif</h2>
        <p className="mt-3 font-display text-3xl">{product.name}</p>
        <dl className="mt-6 divide-y divide-ivory/15 border-y border-ivory/15 text-sm">
          {selections.map((s) => (
            <div key={s.groupId} className="flex justify-between gap-6 py-3">
              <dt className="text-ivory/70">{s.label}</dt>
              <dd className="text-right">{s.valueLabel}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-6 py-3">
            <dt className="text-ivory/70">Fichier</dt>
            <dd className="text-right">{fileSummary}</dd>
          </div>
          <div className="flex justify-between gap-6 py-3">
            <dt className="text-ivory/70">Accompagnement</dt>
            <dd className="text-right">{assistance ? "Oui" : "Non"}</dd>
          </div>
          <div className="flex justify-between gap-6 py-3">
            <dt className="text-ivory/70">Prix</dt>
            <dd className="text-right">{price ? `${money(price.total, price.currency)}${price.preview ? " (démonstration)" : ""}` : "Confirmé sur devis"}</dd>
          </div>
        </dl>

        {!isCustom ? (
          <div className="mt-8 space-y-4">
            {error && (
              <p role="alert" className="border-l-2 border-sand pl-4 text-sm text-sand">
                {error}
              </p>
            )}
            <button type="button" onClick={handleAdd} className={`${buttonClass.solid} w-full !bg-ivory !text-espresso hover:!bg-sand`}>
              Ajouter au panier <span aria-hidden="true" className="arrow arrow-e">→</span>
            </button>
            {added && (
              <div ref={confirmRef} tabIndex={-1} role="status" className="flex flex-col gap-3 border border-ivory/25 p-4 text-sm outline-none sm:flex-row sm:items-center sm:justify-between">
                <p>Ajouté à votre panier.</p>
                <Link href="/panier" className="font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
                  Voir le panier ↗
                </Link>
              </div>
            )}
            <p className="text-xs leading-relaxed text-ivory/70">
              Produit standard : configuration, panier, puis commande. Le prix et le délai vous sont confirmés avant toute production.
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm leading-relaxed text-ivory/80">
            Projet sur mesure : décrivez-le ci-dessous. Nous revenons vers vous avec un devis adapté.
          </p>
        )}
      </section>

      {isCustom && (
        <section aria-labelledby="devis-title" className="mt-14">
          <h2 id="devis-title" className="display display-sm">Demander un devis</h2>
          <div className="mt-8">
            <ProjectForm
              kind="quote"
              submitLabel="Demander un devis"
              hideProjectType
              hideFile
              externalFile={file}
              defaultProjectType={product.category}
              productSlug={product.slug}
              details={{
                produit: product.name,
                options: selections.map((s) => `${s.label} : ${s.valueLabel}`),
                fichier: fileSummary,
                resteAFaire: todo || null,
                accompagnement: assistance,
              }}
              messageLabel="Décrivez votre projet"
              messageHint="Dimensions, lieu d’installation, quantités, usage…"
              beforeSubmit={validateFile}
            />
          </div>
        </section>
      )}
    </div>
  );
}
