"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminModal } from "@/components/admin/admin-modal";
import toast from "react-hot-toast";
import { submitRecruitmentNeedAction } from "@/controllers/recruitment.controller";

export function BesoinsRecrutementModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
        const res = await submitRecruitmentNeedAction(fd);
        if (res.ok) {
            toast.success("Vos besoins ont bien été transmis.");
            onOpenChange(false);
        } else {
            toast.error(res.error || "Erreur lors de la soumission.");
        }
    });
  };

  return (
    <AdminModal open={open} onOpenChange={onOpenChange} title="Exprimer mes besoins">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto px-2 pb-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="poste" placeholder="Poste" required className="w-full" />
            <Input name="nombre" placeholder="Nombre" type="number" required className="w-full" />
            <Input name="niveau" placeholder="Niveau requis" className="md:col-span-2 w-full" />
        </div>
        <Textarea name="experience" placeholder="Expérience souhaitée" className="w-full min-h-[80px]" />
        <Textarea name="competences" placeholder="Compétences clés" className="w-full min-h-[80px]" />
        
        <div className="space-y-2 text-sm border-t pt-4">
            <label className="font-semibold block">Conditions de travail</label>
            <div className="grid grid-cols-2 gap-2">
                {['Stage', 'CDD', 'CDI', 'Journalier'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input type="checkbox" name="conditions" value={type} className="accent-primary" /> {type}
                </label>
                ))}
            </div>
        </div>
        <Input name="salaire" placeholder="Salaire estimatif" className="w-full" />
        <Input name="lieu" placeholder="Lieu de travail" className="w-full" />
        
        <div className="pt-4">
            <Button type="submit" className="w-full bg-primary hover:bg-orange-600 py-6 text-base" disabled={isPending}>
                {isPending ? "Transmission en cours..." : "Transmettre mes besoins"}
            </Button>
        </div>
      </form>
    </AdminModal>
  );
}
