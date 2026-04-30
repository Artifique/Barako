"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { applyToJobAction } from "@/controllers/job-application.controller";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { uploadFileToSupabase } from "@/lib/utils/supabase-upload";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const cover = String(fd.get("cover_letter") ?? "");
    const cvFile = fd.get("cv_file") as File;
    
    if (!cvFile || cvFile.size === 0) {
        toast.error("Veuillez sélectionner un fichier CV valide.");
        return;
    }

    start(async () => {
      let cv_url = null;
      try {
          const uploadRes = await uploadFileToSupabase(supabase, "bourse-images", cvFile);
          if (!uploadRes.ok) {
              toast.error("Erreur lors de l'upload du CV : " + (uploadRes.error || "Problème serveur"));
              return;
          }
          cv_url = uploadRes.data?.url;
      } catch (err) {
          console.error("Upload error:", err);
          toast.error("Une erreur imprévue est survenue lors de l'upload.");
          return;
      }

      const res = await applyToJobAction({
        job_offer_id: jobOfferId,
        cover_letter: cover || null,
        cv_url: cv_url
      });
      if (res.ok) {
          toast.success("Votre candidature a bien été transmise.");
          (e.target as HTMLFormElement).reset();
      }
      else toast.error(res.error || "Erreur lors de la soumission.");
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
      <textarea name="cover_letter" rows={4} className="input-field w-full border rounded-lg p-2" />
      <label className="block text-xs font-medium text-slate-600">Télécharger votre CV</label>
      <Input name="cv_file" type="file" accept=".pdf,.doc,.docx" required />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Envoi…" : "Postuler maintenant"}
      </Button>
    </form>
  );
}
