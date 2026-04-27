"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { applyToJobAction } from "@/controllers/job-application.controller";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function ApplyJobForm({
  jobOfferId,
  isAuthenticated,
  canApply
}: {
  jobOfferId: string;
  isAuthenticated: boolean;
  canApply: boolean;
}) {
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const cover = String(fd.get("cover_letter") ?? "");
    const cv = String(fd.get("cv_url") ?? "");
    start(async () => {
      const res = await applyToJobAction({
        job_offer_id: jobOfferId,
        cover_letter: cover || null,
        cv_url: cv || null
      });
      if (res.ok) toast.success("Candidature envoyée");
      else toast.error(res.error);
    });
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-6">
        <p className="text-sm text-slate-600">Connecte-toi pour postuler.</p>
        <Link href={`/auth/connexion?next=/bourses/${jobOfferId}`}>
          <Button className="mt-3 w-full">Connexion</Button>
        </Link>
      </div>
    );
  }

  if (!canApply) {
    return (
      <p className="mt-6 text-sm text-slate-600">
        Seuls les profils « demandeur d’emploi » peuvent postuler. Mets à jour ton rôle dans ton profil si besoin.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label className="block text-xs font-medium text-slate-600">Lettre de motivation (optionnel)</label>
      <textarea name="cover_letter" rows={4} className="input-field" />
      <label className="block text-xs font-medium text-slate-600">Lien CV (PDF hébergé — Storage Supabase)</label>
      <Input name="cv_url" placeholder="https://..." />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Envoi…" : "Postuler maintenant"}
      </Button>
    </form>
  );
}
