"use client";

import { useActionState } from "react";
import type { ActionState } from "./actions";

export const adminInput =
  "mt-2 w-full border border-[#d3c9ba] bg-white px-3 py-2.5 text-sm text-espresso outline-none focus:border-espresso";

export function Label({ children, htmlFor, hint }: { children: React.ReactNode; htmlFor: string; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
      {children}
      {hint && <span className="ml-2 font-normal normal-case tracking-normal">{hint}</span>}
    </label>
  );
}

export function Feedback({ state }: { state: ActionState }) {
  if (!state.error && !state.success) return null;
  return (
    <p
      role={state.error ? "alert" : "status"}
      className={`border-l-2 pl-3 text-sm ${state.error ? "border-[#8c3b2b] text-[#8c3b2b]" : "border-olive text-olive-deep"}`}
    >
      {state.error ?? state.success}
    </p>
  );
}

export function SubmitButton({ children, pending }: { children: React.ReactNode; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center bg-espresso px-6 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-olive-deep disabled:opacity-50"
    >
      {pending ? "Enregistrement…" : children}
    </button>
  );
}

/** Wraps a server action with state + pending handling. */
export function useAdminAction(action: (prev: ActionState, fd: FormData) => Promise<ActionState>) {
  return useActionState(action, {} as ActionState);
}
