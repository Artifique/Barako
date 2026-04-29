"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { createJobOfferAction } from "@/controllers/job-offer.controller";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function JobOfferCreateForm({ companyId }: { companyId?: string | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (companyId) fd.append("company_id", companyId);
    start(async () => {
      const res = await createJobOfferAction(fd);
      if (res.ok) {
        toast.success("Votre offre de bourse a été publiée.");
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid max-w-2xl gap-3">
      <Input name="title" placeholder="Intitulé du poste" required />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="contract_type" placeholder="Type (CDI, CDD…)" defaultValue="CDI" />
        <Input name="location" placeholder="Lieu" defaultValue="Bamako, Mali" />
      </div>
      <Input name="sector" placeholder="Secteur" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="salary_min" type="number" placeholder="Salaire min (FCFA)" />
        <Input name="salary_max" type="number" placeholder="Salaire max (FCFA)" />
      </div>
      <label className="text-xs font-medium text-slate-600">Date d’expiration</label>
      <Input name="expires_at" type="datetime-local" />
      <textarea name="description" rows={3} placeholder="Description" className="input-field" />
      <textarea name="missions" rows={2} placeholder="Missions" className="input-field" />
      <textarea name="requirements" rows={2} placeholder="Profil recherché" className="input-field" />
      <textarea name="benefits" rows={2} placeholder="Avantages" className="input-field" />
      <label className="text-xs font-medium text-slate-600">Image de la bourse</label>
      <input type="file" name="image" accept="image/*" className="input-field mt-1" />
      <label className="text-xs font-medium text-slate-600">Type de bourse</label>
      <select name="type_bourse" defaultValue="regular" className="input-field">
        <option value="regular">Régulière</option>
        <option value="tchakeda">Tchakèda</option>
      </select>
      <label className="text-xs font-medium text-slate-600">Statut</label>
      <select name="status" defaultValue="draft" className="input-field">
        <option value="draft">Brouillon</option>
        <option value="published">Publiée</option>
        <option value="closed">Fermée</option>
      </select>
      <Button type="submit" disabled={pending}>
        {pending ? "…" : "Créer l’offre"}
      </Button>
    </form>
  );
}
