"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { createJobOfferAction } from "@/controllers/job-offer.controller";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function JobOfferCreateForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await createJobOfferAction({
        company_id: companyId,
        title: String(fd.get("title") ?? "").trim(),
        contract_type: String(fd.get("contract_type") ?? "CDI"),
        location: String(fd.get("location") ?? "Bamako, Mali"),
        description: String(fd.get("description") ?? "") || null,
        missions: String(fd.get("missions") ?? "") || null,
        requirements: String(fd.get("requirements") ?? "") || null,
        benefits: String(fd.get("benefits") ?? "") || null,
        sector: String(fd.get("sector") ?? "") || null,
        salary_min: fd.get("salary_min") ? Number(fd.get("salary_min")) : null,
        salary_max: fd.get("salary_max") ? Number(fd.get("salary_max")) : null,
        expires_at: String(fd.get("expires_at") ?? "") || null,
        status: (String(fd.get("status") ?? "draft") as "draft" | "published" | "closed")
      });
      if (res.ok) {
        toast.success("Offre créée");
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
