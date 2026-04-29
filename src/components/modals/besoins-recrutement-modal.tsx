"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminModal } from "@/components/admin/admin-modal";
import toast from "react-hot-toast";

export function BesoinsRecrutementModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vos besoins ont bien été transmis.");
    onOpenChange(false);
  };

  return (
    <AdminModal open={open} onOpenChange={onOpenChange} title="Exprimer mes besoins">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <Input name="poste" placeholder="Poste" required />
            <Input name="nombre" placeholder="Nombre" type="number" required />
            <Input name="niveau" placeholder="Niveau requis" className="col-span-2" />
        </div>
        <Textarea name="experience" placeholder="Expérience souhaitée" />
        <Textarea name="competences" placeholder="Compétences clés" />
        
        <div className="space-y-2 text-sm">
            <label className="font-semibold">Conditions de travail</label>
            <div className="grid grid-cols-2 gap-2">
                {['Stage', 'CDD', 'CDI', 'Journalier'].map(type => (
                <label key={type} className="flex items-center gap-2"><input type="checkbox" name="conditions" value={type} /> {type}</label>
                ))}
            </div>
        </div>
        <Input name="salaire" placeholder="Salaire" />
        <Input name="lieu" placeholder="Lieu de travail" />
        <Button type="submit" className="w-full">Envoyer mes besoins</Button>
      </form>
    </AdminModal>
  );
}
