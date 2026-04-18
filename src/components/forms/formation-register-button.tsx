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
      <Link href="/auth/connexion?next=/formations" className="mt-4 inline-block">
        <Button variant="outline" className="w-full">
          S’inscrire (connexion requise)
        </Button>
      </Link>
    );
  }

  return (
    <Button
      className="mt-4 w-full"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await registerFormationAction(formationId);
          if (res.ok) toast.success("Inscription enregistrée");
          else toast.error(res.error);
        })
      }
    >
      {pending ? "…" : "S’inscrire à cette formation"}
    </Button>
  );
}
