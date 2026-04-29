"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function BesoinsRecrutementForm() {
  return (
    <form className="space-y-6 p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold">Exprimer mes besoins</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Poste" />
        <Input placeholder="Nombre" type="number" />
        <Input placeholder="Niveau requis" className="col-span-2" />
      </div>
      <Textarea placeholder="Expérience souhaitée" />
      <Textarea placeholder="Compétences clés" />
      <div className="space-y-2">
        <label className="font-semibold">Conditions de travail</label>
        {['Stage', 'CDD', 'CDI', 'Journalier'].map(type => (
          <label key={type} className="flex items-center gap-2"><input type="checkbox" /> {type}</label>
        ))}
      </div>
      <Input placeholder="Salaire" />
      <Input placeholder="Lieu de travail" />
      <Button type="submit">Envoyer mes besoins</Button>
    </form>
  );
}
