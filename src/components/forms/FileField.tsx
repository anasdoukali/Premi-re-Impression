"use client";

import { useId, useRef } from "react";
import { useSettings } from "@/components/SettingsProvider";

export type PickedFile = { name: string; size: number } | null;

export function formatBytes(n: number) {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}

/** Accessible native file input + honest status about file transfer. */
export function FileField({
  label = "Ajouter un fichier",
  optional = true,
  value,
  onChange,
  error,
  onError,
}: {
  label?: string;
  optional?: boolean;
  value: PickedFile;
  onChange: (f: PickedFile) => void;
  error?: string;
  onError?: (msg: string | undefined) => void;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const settings = useSettings();
  const uploadOn = settings.services.fileUpload;

  return (
    <div>
      <label htmlFor={id} className="block text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
        {label} {optional && <span className="font-normal normal-case tracking-normal text-ink-soft">— facultatif</span>}
      </label>
      <input
        ref={input}
        id={id}
        type="file"
        accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.tif,.tiff,.psd,.indd,.idml,.zip,.doc,.docx,.ppt,.pptx"
        aria-describedby={`${id}-help${error ? ` ${id}-err` : ""}`}
        aria-invalid={error ? true : undefined}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return onChange(null);
          if (f.size > settings.maxFileSizeMb * 1024 * 1024) {
            onError?.(`Ce fichier dépasse ${settings.maxFileSizeMb} Mo.`);
            e.target.value = "";
            return onChange(null);
          }
          onError?.(undefined);
          onChange({ name: f.name, size: f.size });
        }}
        className="mt-3 block w-full cursor-pointer text-sm text-ink-soft file:mr-4 file:min-h-11 file:cursor-pointer file:border file:border-espresso file:bg-transparent file:px-5 file:py-2.5 file:text-[0.75rem] file:font-semibold file:uppercase file:tracking-[0.14em] file:text-espresso hover:file:bg-espresso hover:file:text-ivory"
      />
      <p id={`${id}-help`} className="mt-2 text-xs leading-relaxed text-ink-soft">
        PDF, AI, SVG, PNG, JPG, PSD, INDD, ZIP… jusqu’à {settings.maxFileSizeMb} Mo.
        {!uploadOn && " Le transfert de fichiers n’est pas encore activé : nous noterons le nom du fichier et vous indiquerons comment nous le transmettre."}
      </p>
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-espresso">
          {error}
        </p>
      )}
      {value && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-line bg-sand/40 px-4 py-3 text-sm">
          <p>
            <span className="font-semibold">{value.name}</span> <span className="text-ink-soft">· {formatBytes(value.size)}</span>
            {!uploadOn && <span className="block text-xs text-ink-soft">Sélectionné — non transmis</span>}
          </p>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (input.current) input.current.value = "";
              input.current?.focus();
            }}
            className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
          >
            Retirer
          </button>
        </div>
      )}
    </div>
  );
}
