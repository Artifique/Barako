"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createFormationAdminAction,
  deleteFormationAdminAction,
  updateFormationAdminAction
} from "@/controllers/formation.controller";
import { FormationTypes, type Formation, type FormationType } from "@/models";
import { AdminModal } from "@/components/admin/admin-modal";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";

function FormationFields({ formation }: { formation?: Formation }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Titre</label>
        <input name="title" required className="input-field mt-1 w-full" defaultValue={formation?.title ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Instructeur</label>
        <input name="instructor_name" className="input-field mt-1 w-full" defaultValue={formation?.instructor_name ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Niveau</label>
        <input name="level" className="input-field mt-1 w-full" defaultValue={formation?.level ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Bio Instructeur</label>
        <textarea name="instructor_bio" rows={2} className="input-field mt-1 w-full" defaultValue={formation?.instructor_bio ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Prérequis</label>
        <textarea name="prerequisites" rows={2} className="input-field mt-1 w-full" defaultValue={formation?.prerequisites ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Image</label>
        <input type="file" name="image" accept="image/*" className="input-field mt-1 w-full" />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea name="description" rows={3} className="input-field mt-1 w-full" defaultValue={formation?.description ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Date de début</label>
        <input type="date" name="start_date" required className="input-field mt-1 w-full" defaultValue={formation?.start_date ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Places max</label>
        <input name="max_places" type="number" min={1} className="input-field mt-1 w-full" defaultValue={formation?.max_places ?? 25} />
      </div>
    </div>
  );
}

export function AdminFormationsPanel({ formations }: { formations: Formation[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<Formation | null>(null);
  const [del, setDel] = useState<Formation | null>(null);

  const onSubmit = async (fd: FormData, id?: string) => {
    startTransition(async () => {
      const res = id ? await updateFormationAdminAction(id, fd) : await createFormationAdminAction(fd);
      if (res.ok) {
        toast.success(id ? "Formation mise à jour" : "Formation créée");
        setCreateOpen(false); setEdit(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  const onDelete = () => {
    if (!del) return;
    startTransition(async () => {
      const res = await deleteFormationAdminAction(del.id);
      if (res.ok) {
        toast.success("Formation supprimée");
        setDel(null);
        router.refresh();
      } else toast.error(res.error);
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Formations" subtitle="Gérez vos sessions de formation." />
      <Button onClick={() => setCreateOpen(true)}>Nouvelle formation</Button>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 uppercase text-xs">
            <tr><th className="p-3">Formation</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {formations.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-3">{f.title}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" onClick={() => setEdit(f)}>✏️</Button>
                  <Button variant="ghost" onClick={() => setDel(f)}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <AdminModal open={createOpen} onOpenChange={setCreateOpen} title="Ajout" footer={<Button type="submit" form="f-add">Ajouter</Button>}>
        <form id="f-add" onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}><FormationFields /></form>
      </AdminModal>

      <AdminModal open={!!edit} onOpenChange={(o) => !o && setEdit(null)} title="Modifier" footer={<Button type="submit" form="f-edit">Enregistrer</Button>}>
        <form id="f-edit" onSubmit={(e) => { e.preventDefault(); edit && onSubmit(new FormData(e.currentTarget), edit.id); }}><FormationFields formation={edit ?? undefined} /></form>
      </AdminModal>

      <ConfirmDeleteModal open={!!del} onOpenChange={(o) => !o && setDel(null)} onConfirm={onDelete} pending={isPending} title="Supprimer formation ?" />
    </div>
  );
}
