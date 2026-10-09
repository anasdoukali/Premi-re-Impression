"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { projectTypes } from "@/config/site";
import { useSettings } from "@/components/SettingsProvider";
import { buttonClass } from "@/components/ui/ArrowLink";
import { FileField, type PickedFile } from "./FileField";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string; hadFile: boolean }
  | { state: "error"; message: string };

type Props = {
  kind: "contact" | "quote" | "cart";
  submitLabel?: string;
  defaultProjectType?: string;
  hideProjectType?: boolean;
  hideFile?: boolean;
  /** When the file was chosen elsewhere (e.g. in the configurator) */
  externalFile?: PickedFile;
  productSlug?: string;
  details?: Record<string, unknown>;
  messageLabel?: string;
  messageHint?: string;
  initialMessage?: string;
  /** Extra check before submit (e.g. configurator validation) */
  beforeSubmit?: () => string | null;
  onSuccess?: () => void;
  intro?: ReactNode;
};

type Errors = Partial<Record<"name" | "email" | "message" | "file", string>>;

function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
        {label} {optional && <span className="font-normal normal-case tracking-normal text-ink-soft">— facultatif</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-2 text-xs text-ink-soft">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-espresso">
          {error}
        </p>
      )}
    </div>
  );
}

export function ProjectForm({
  kind,
  submitLabel = "Parlons de mon projet",
  defaultProjectType,
  hideProjectType,
  hideFile,
  externalFile,
  productSlug,
  details,
  messageLabel = "Message",
  messageHint,
  initialMessage = "",
  beforeSubmit,
  onSuccess,
  intro,
}: Props) {
  const uid = useId();
  const settings = useSettings();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: defaultProjectType ?? "",
    deadline: "",
    message: initialMessage,
  });
  const [file, setFile] = useState<PickedFile>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [formError, setFormError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status.state === "success" || status.state === "error") resultRef.current?.focus();
  }, [status.state]);

  const set = (k: keyof typeof values) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  function validate(): Errors {
    const e: Errors = {};
    if (values.name.trim().length < 2) e.name = "Indiquez votre nom.";
    if (!EMAIL_RE.test(values.email.trim())) e.email = "Indiquez une adresse email valide, par exemple nom@domaine.fr.";
    if (values.message.trim().length < 10) e.message = "Quelques mots suffisent (10 caractères minimum).";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setFormError(null);
    const pre = beforeSubmit?.() ?? null;
    const e = validate();
    setErrors(e);
    if (pre) {
      setFormError(pre);
      return;
    }
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const attachment = hideFile ? externalFile ?? null : file;
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          ...values,
          projectType: values.projectType || null,
          productSlug,
          details,
          attachmentName: attachment?.name ?? null,
          attachmentSize: attachment?.size ?? null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reference?: string; error?: string; fields?: Errors };
      if (!res.ok || !data.reference) {
        if (data.fields) setErrors(data.fields);
        setStatus({ state: "error", message: data.error ?? "Votre demande n’a pas pu être enregistrée." });
        return;
      }
      setStatus({ state: "success", reference: data.reference, hadFile: Boolean(attachment) });
      onSuccess?.();
    } catch {
      setStatus({
        state: "error",
        message: "Connexion impossible. Votre demande n’a pas été envoyée : vérifiez votre connexion et réessayez.",
      });
    }
  }

  if (status.state === "success") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="border border-espresso/20 bg-sand/50 p-8 outline-none md:p-12">
        <p className="eyebrow text-ink-soft">Demande enregistrée</p>
        <p className="mt-5 font-display text-4xl leading-tight md:text-5xl">Merci. On s’en occupe.</p>
        <p className="mt-5 max-w-lg leading-relaxed text-ink-soft">
          Votre demande est enregistrée sous la référence <strong className="text-espresso">{status.reference}</strong>. Notre
          équipe revient vers vous par email.
        </p>
        {status.hadFile && !settings.services.fileUpload && (
          <p className="mt-4 max-w-lg border-l border-espresso/40 pl-4 text-sm leading-relaxed text-ink-soft">
            Votre fichier n’a pas été transmis : le transfert n’est pas encore activé. Nous vous indiquerons comment nous
            l’envoyer.
          </p>
        )}
      </div>
    );
  }

  const describedBy = (k: keyof Errors, hint?: boolean) =>
    [errors[k] ? `${uid}-${k}-err` : null, hint ? `${uid}-${k}-hint` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-9" aria-describedby={intro ? `${uid}-intro` : undefined}>
      {intro && <div id={`${uid}-intro`}>{intro}</div>}
      <div className="grid gap-9 sm:grid-cols-2">
        <Field id={`${uid}-name`} label="Nom" error={errors.name}>
          <input
            id={`${uid}-name`}
            className="field-input"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
          />
        </Field>
        <Field id={`${uid}-email`} label="Email" error={errors.email}>
          <input
            id={`${uid}-email`}
            type="email"
            className="field-input"
            autoComplete="email"
            inputMode="email"
            required
            value={values.email}
            onChange={(e) => set("email")(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
          />
        </Field>
        <Field id={`${uid}-phone`} label="Téléphone" optional>
          <input
            id={`${uid}-phone`}
            type="tel"
            className="field-input"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => set("phone")(e.target.value)}
          />
        </Field>
        {!hideProjectType ? (
          <Field id={`${uid}-projectType`} label="Type de projet">
            <select
              id={`${uid}-projectType`}
              className="field-input"
              value={values.projectType}
              onChange={(e) => set("projectType")(e.target.value)}
            >
              <option value="">Choisir…</option>
              {projectTypes.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <Field id={`${uid}-deadline`} label="Délai souhaité" optional>
            <input
              id={`${uid}-deadline`}
              className="field-input"
              placeholder="ex. avant le 15 juin"
              value={values.deadline}
              onChange={(e) => set("deadline")(e.target.value)}
            />
          </Field>
        )}
      </div>
      {!hideProjectType && (
        <Field id={`${uid}-deadline`} label="Délai souhaité" optional>
          <input
            id={`${uid}-deadline`}
            className="field-input"
            placeholder="ex. avant le 15 juin, ou « dès que possible »"
            value={values.deadline}
            onChange={(e) => set("deadline")(e.target.value)}
          />
        </Field>
      )}
      <Field id={`${uid}-message`} label={messageLabel} error={errors.message} hint={messageHint}>
        <textarea
          id={`${uid}-message`}
          className="field-input"
          rows={5}
          required
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", Boolean(messageHint))}
        />
      </Field>
      {!hideFile && (
        <FileField value={file} onChange={setFile} error={errors.file} onError={(m) => setErrors((s) => ({ ...s, file: m }))} />
      )}

      {formError && (
        <p role="alert" className="border-l-2 border-brand-brown pl-4 text-sm text-espresso">
          {formError}
        </p>
      )}
      {status.state === "error" && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="border-l-2 border-brand-brown pl-4 text-sm text-espresso outline-none">
          {status.message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status.state === "submitting"} className={`${buttonClass.solid} w-full sm:w-auto`}>
          {status.state === "submitting" ? "Envoi en cours…" : submitLabel}
          <span aria-hidden="true" className="arrow arrow-ne text-base">↗</span>
        </button>
        <p className="text-xs leading-relaxed text-ink-soft sm:max-w-xs">
          Vos informations servent uniquement à répondre à votre demande.
        </p>
      </div>
      <p aria-live="polite" className="sr-only">
        {status.state === "submitting" ? "Envoi de votre demande en cours" : ""}
      </p>
    </form>
  );
}
