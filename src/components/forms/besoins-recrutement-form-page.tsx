"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import { submitRecruitmentNeedAction } from "@/controllers/recruitment.controller";
import { useRouter } from "next/navigation";

export function BesoinsRecrutementForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
        const res = await submitRecruitmentNeedAction(fd);
        if (res.ok) {
            toast.success("Vos besoins ont bien été transmis.");
            router.push("/profil");
        } else {
            toast.error(res.error || "Erreur lors de la soumission.");
        }
    });
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Exprimer mes besoins</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="poste" placeholder="Poste" required />
            <Input name="nombre" placeholder="Nombre" type="number" required />
            <Input name="niveau" placeholder="Niveau requis" className="md:col-span-2" />
        </div>
        <Textarea name="experience" placeholder="Expérience souhaitée" />
        <Textarea name="competences" placeholder="Compétences clés" />
        
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
        <Input name="salaire" placeholder="Salaire estimatif" />
        <Input name="lieu" placeholder="Lieu de travail" />
        
        <Button type="submit" className="w-full bg-primary hover:bg-orange-600" disabled={isPending}>
            {isPending ? "Transmission en cours..." : "Transmettre mes besoins"}
        </Button>
      </form>
    </Card>
  );
}
