"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUpWithEmail, type AuthFormState } from "@/controllers/auth.controller";
import type { UserRole } from "@/models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const initial: AuthFormState = {};

const roles: { id: UserRole; label: string; emoji: string }[] = [
  { id: "job_seeker", label: "Je cherche un emploi", emoji: "👤" },
  { id: "entrepreneur", label: "Je suis porteur de projet", emoji: "💡" },
  { id: "company", label: "Je suis une entreprise", emoji: "🏢" }
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Création…" : "Créer mon compte"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(signUpWithEmail, initial);
  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="text-sm text-error">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}
      <div>
        <label className="text-xs font-medium text-slate-600">Nom complet</label>
        <Input name="full_name" required className="mt-1" autoComplete="name" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Email</label>
        <Input name="email" type="email" required className="mt-1" autoComplete="email" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Mot de passe</label>
        <Input name="password" type="password" required className="mt-1" autoComplete="new-password" />
      </div>
      <fieldset>
        <legend className="text-xs font-medium text-slate-600">Rôle</legend>
        <div className="mt-2 grid gap-2">
          {roles.map((r, i) => (
            <label
              key={r.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 transition hover:border-primary/40 hover:bg-white",
                i === 0 && "border-primary/40 ring-1 ring-primary/15"
              )}
            >
              <input type="radio" name="role" value={r.id} defaultChecked={i === 0} className="accent-primary" />
              <span className="text-lg">{r.emoji}</span>
              <span className="text-sm text-slate-800">{r.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <SubmitButton />
    </form>
  );
}
