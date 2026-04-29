"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createAvantageAction, deleteAvantageAction, updateAvantageAction } from "@/controllers/avantage.controller";
import type { Avantage } from "@/models/avantage";
import { AdminModal } from "@/components/admin/admin-modal";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { uploadFileToSupabase } from "@/lib/utils/supabase-upload";
import { createClient } from "@/lib/supabase/client";

function AvantageFields({ avantage }: { avantage?: Avantage }) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-700">Titre</label>
        <input name="title" required className="input-field mt-1 w-full" defaultValue={avantage?.title ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea name="description" required rows={3} className="input-field mt-1 w-full" defaultValue={avantage?.description ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Image</label>
        <input type="file" name="image" accept="image/*" className="mt-1 w-full" />
        {avantage?.image_url && <img src={avantage.image_url} alt="Aperçu" className="mt-2 h-20" />}
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
  const supabase = createClient();

  const onSubmit = async (fd: FormData, id?: string) => {
    const file = fd.get("image") as File;
    let image_url = id ? edit?.image_url : null;

    if (file && file.size > 0) {
      const uploadRes = await uploadFileToSupabase(supabase, "bourse-images", file);
      if (!uploadRes.ok) return toast.error("Erreur upload image");
      image_url = uploadRes.data?.url || null;
    }

    const input = {
      title: String(fd.get("title")),
      description: String(fd.get("description")),
      image_url: image_url || undefined,
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
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Titre</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {avantages.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3">
                  {a.image_url ? (
                    <img src={a.image_url} alt={a.title} className="h-10 w-10 object-cover rounded" />
                  ) : (
                    <div className="h-10 w-10 bg-slate-100 rounded" />
                  )}
                </td>
                <td className="p-3 font-medium">{a.title}</td>
                <td className="p-3 text-slate-600 truncate max-w-[200px]">{a.description}</td>
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
