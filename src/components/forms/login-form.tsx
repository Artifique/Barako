"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signInWithEmail, type AuthFormState } from "@/controllers/auth.controller";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initial: AuthFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Connexion…" : "Se connecter"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(signInWithEmail, initial);
  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="text-sm text-error">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}
      <div>
        <label className="text-xs font-medium text-slate-600">Email</label>
        <Input name="email" type="email" required autoComplete="email" className="mt-1" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Mot de passe</label>
        <Input name="password" type="password" required autoComplete="current-password" className="mt-1" />
      </div>
      <SubmitButton />
    </form>
  );
}
