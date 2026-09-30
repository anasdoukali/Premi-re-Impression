"use client";

import { loginAction } from "../actions";
import { Feedback, Label, SubmitButton, adminInput, useAdminAction } from "../AdminUI";

export function LoginForm() {
  const [state, action, pending] = useAdminAction(loginAction);
  return (
    <form action={action} className="space-y-6">
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={adminInput} />
      </div>
      <Feedback state={state} />
      <SubmitButton pending={pending}>Se connecter</SubmitButton>
    </form>
  );
}
