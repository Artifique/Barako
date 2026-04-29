"use client";

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
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="poste" placeholder="Poste" required className="w-full" />
            <Input name="nombre" placeholder="Nombre" type="number" required className="w-full" />
            <Input name="niveau" placeholder="Niveau requis" className="md:col-span-2 w-full" />
        </div>
        <Textarea name="experience" placeholder="Expérience souhaitée" className="w-full" />
        <Textarea name="competences" placeholder="Compétences clés" className="w-full" />
        
        <div className="space-y-2 text-sm border-t pt-4">
            <label className="font-semibold block">Conditions de travail</label>
            <div className="grid grid-cols-2 gap-2">
                {['Stage', 'CDD', 'CDI', 'Journalier'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="conditions" value={type} className="accent-primary" /> {type}
                </label>
                ))}
            </div>
        </div>
        <Input name="salaire" placeholder="Salaire" className="w-full" />
        <Input name="lieu" placeholder="Lieu de travail" className="w-full" />
        <div className="sticky bottom-0 bg-white pt-2">
            <Button type="submit" className="w-full bg-primary hover:bg-orange-600">Envoyer mes besoins</Button>
        </div>
      </form>
    </AdminModal>
  );
}
