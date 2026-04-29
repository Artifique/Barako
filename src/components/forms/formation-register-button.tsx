"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { registerFormationAction } from "@/controllers/formation.controller";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FormationRegisterButton({
  formationId,
  isAuthenticated
}: {
  formationId: string;
  isAuthenticated: boolean;
}) {
  const [pending, start] = useTransition();

  if (!isAuthenticated) {
    return (
      <Link href="/auth/connexion?next=/formations" className="mt-0 inline-block w-full">
        <Button
          variant="outline"
          className="w-full border-dashed border-slate-300/90 text-slate-700 transition hover:border-primary/40 hover:bg-sky-50/90 hover:text-primary"
        >
          S’inscrire (connexion requise)
        </Button>
      </Link>
    );
  }

  return (
    <Button
      className="w-full bg-gradient-to-r from-primary to-teal-700 text-white shadow-md shadow-slate-400/25 transition hover:brightness-[1.03]"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await registerFormationAction(formationId);
          if (res.ok) toast.success("Votre inscription à la formation a été confirmée.");
          else toast.error(res.error);
        })
      }
    >
      {pending ? "…" : "S’inscrire à cette formation"}
    </Button>
  );
}
