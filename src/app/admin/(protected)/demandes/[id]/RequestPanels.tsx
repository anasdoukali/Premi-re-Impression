"use client";

import { addRequestNote, deleteRequest, updateRequestStatus } from "../../../actions";
import { Feedback, SubmitButton, adminInput, useAdminAction } from "../../../AdminUI";
import { requestStatuses } from "@/config/site";

export function StatusForm({ id, status }: { id: number; status: string }) {
  const [state, action, pending] = useAdminAction(updateRequestStatus);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="status" className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        Statut
      </label>
      <select id="status" name="status" defaultValue={status} className={adminInput}>
        {requestStatuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <Feedback state={state} />
      <SubmitButton pending={pending}>Mettre à jour</SubmitButton>
    </form>
  );
}

export function NoteForm({ id }: { id: number }) {
  const [state, action, pending] = useAdminAction(addRequestNote);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor="author" className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Auteur
        </label>
        <input id="author" name="author" defaultValue="Équipe" className={adminInput} />
      </div>
      <div>
        <label htmlFor="body" className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Note interne
        </label>
        <textarea id="body" name="body" rows={4} required className={adminInput} />
      </div>
      <Feedback state={state} />
      <SubmitButton pending={pending}>Ajouter la note</SubmitButton>
    </form>
  );
}

export function DeleteRequestForm({ id }: { id: number }) {
  return (
    <form
      action={deleteRequest}
      onSubmit={(e) => {
        if (!confirm("Supprimer définitivement cette demande ?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c3b2b] underline underline-offset-4">
        Supprimer la demande
      </button>
    </form>
  );
}
