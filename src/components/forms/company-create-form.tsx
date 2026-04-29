"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { createCompanyAction } from "@/controllers/company.controller";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CompanyCreateForm() {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await createCompanyAction({
        name: String(fd.get("name") ?? "").trim(),
        location: String(fd.get("location") ?? "").trim() || null,
        description: String(fd.get("description") ?? "").trim() || null,
        website: String(fd.get("website") ?? "").trim() || null
      });
      if (res.ok) {
        toast.success("L'entreprise a été enregistrée avec succès.");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid max-w-xl gap-3">
      <Input name="name" placeholder="Nom de l’entreprise" required />
      <Input name="location" placeholder="Localisation" />
      <Input name="website" placeholder="Site web" />
      <textarea
        name="description"
        rows={3}
        placeholder="Description"
        className="input-field"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "…" : "Créer l’entreprise"}
      </Button>
    </form>
  );
}
