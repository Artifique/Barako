"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createAvantageAction, deleteAvantageAction, updateAvantageAction } from "@/controllers/avantage.controller";
import type { Avantage } from "@/services/avantage.service";
import { AdminModal } from "@/components/admin/admin-modal";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";

function AvantageFields({ avantage }: { avantage?: Avantage }) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-700">Titre</label>
        <input name="title" required className="input-field mt-1 w-full" defaultValue={avantage?.title ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea name="description" required rows={2} className="input-field mt-1 w-full" defaultValue={avantage?.description ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Icône (ex: "star")</label>
        <input name="icon" className="input-field mt-1 w-full" defaultValue={avantage?.icon ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Ordre</label>
        <input name="display_order" type="number" className="input-field mt-1 w-full" defaultValue={avantage?.display_order ?? 0} />
      </div>
    </div>
  );
}

export function AdminAvantagesPanel({ avantages }: { avantages: Avantage[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<Avantage | null>(null);
  const [del, setDel] = useState<Avantage | null>(null);

  const onSubmit = async (fd: FormData, id?: string) => {
    const input = {
      title: String(fd.get("title")),
      description: String(fd.get("description")),
      icon: String(fd.get("icon") || ""),
      display_order: Number(fd.get("display_order") || 0),
    };
    startTransition(async () => {
      const res = id ? await updateAvantageAction(id, input) : await createAvantageAction(input);
      if (res.ok) {
        toast.success(id ? "Avantage mis à jour" : "Avantage créé");
        setCreateOpen(false); setEdit(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  const onDelete = () => {
    if (!del) return;
    startTransition(async () => {
      const res = await deleteAvantageAction(del.id);
      if (res.ok) {
        toast.success("Avantage supprimé"); setDel(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Avantages Entreprise" subtitle="Gérez les avantages affichés sur le profil entreprise." />
      <Button onClick={() => setCreateOpen(true)}>Nouvel avantage</Button>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 uppercase text-xs">
            <tr><th className="p-3">Titre</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {avantages.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3 font-medium">{a.title}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" onClick={() => setEdit(a)}>✏️</Button>
                  <Button variant="ghost" onClick={() => setDel(a)}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <AdminModal open={createOpen} onOpenChange={setCreateOpen} title="Ajout" footer={<Button type="submit" form="a-add">Créer</Button>}><form id="a-add" onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}><AvantageFields /></form></AdminModal>
      <AdminModal open={!!edit} onOpenChange={(o) => !o && setEdit(null)} title="Modifier" footer={<Button type="submit" form="a-edit">Enregistrer</Button>}><form id="a-edit" onSubmit={(e) => { e.preventDefault(); edit && onSubmit(new FormData(e.currentTarget), edit.id); }}><AvantageFields avantage={edit ?? undefined} /></form></AdminModal>
      <ConfirmDeleteModal open={!!del} onOpenChange={(o) => !o && setDel(null)} onConfirm={onDelete} pending={isPending} title="Supprimer cet avantage ?" />
    </div>
  );
}
