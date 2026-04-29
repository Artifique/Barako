"use client";

import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { createUserAdminAction } from "@/controllers/profile.controller";
import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";

export function AdminUserAddModal({ open, onOpenChange, onCreated }: { open: boolean, onOpenChange: (open: boolean) => void, onCreated: () => void }) {
  const [isPending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await createUserAdminAction({
        email: formData.get("email") as string,
        full_name: formData.get("full_name") as string,
        role: formData.get("role") as string,
      });
      if (res.ok) {
        toast.success("Utilisateur créé");
        onCreated();
        onOpenChange(false);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <AdminModal open={open} onOpenChange={onOpenChange} title="Ajouter un utilisateur">
      <form action={onSubmit} className="grid gap-4">
        <input name="full_name" placeholder="Nom complet" required className="input-field w-full" />
        <input name="email" type="email" placeholder="Email" required className="input-field w-full" />
        <select name="role" className="input-field w-full">
          <option value="job_seeker">Chercheur d'emploi</option>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="company">Entreprise</option>
          <option value="admin">Administrateur</option>
        </select>
        <Button type="submit" disabled={isPending}>Créer</Button>
      </form>
    </AdminModal>
  );
}
