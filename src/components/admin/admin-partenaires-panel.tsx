"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createPartnerAdminAction,
  deletePartnerAdminAction,
  updatePartnerAdminAction
} from "@/controllers/partner.controller";
import type { Partner } from "@/models";
import { AdminModal } from "@/components/admin/admin-modal";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";

function SponsorFields({ sponsor }: { sponsor?: Partner }) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-700">Nom</label>
        <input name="name" required className="input-field mt-1 w-full" defaultValue={sponsor?.name ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Logo (URL)</label>
        <input name="logo_url" className="input-field mt-1 w-full" defaultValue={sponsor?.logo_url ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Contact (Email/Téléphone)</label>
        <input name="website" className="input-field mt-1 w-full" defaultValue={sponsor?.website ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Ordre d'affichage</label>
        <input name="display_order" type="number" className="input-field mt-1 w-full" defaultValue={sponsor?.display_order ?? 0} />
      </div>
    </div>
  );
}

export function AdminSponsorsPanel({ sponsors }: { sponsors: Partner[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<Partner | null>(null);
  const [del, setDel] = useState<Partner | null>(null);

  const onSubmit = async (fd: FormData, id?: string) => {
    const input = {
      name: String(fd.get("name")),
      logo_url: String(fd.get("logo_url") || ""),
      website: String(fd.get("website") || ""),
      display_order: Number(fd.get("display_order") || 0),
    };
    startTransition(async () => {
      const res = id ? await updatePartnerAdminAction(id, input) : await createPartnerAdminAction(input);
      if (res.ok) {
        toast.success(id ? "Sponsor mis à jour" : "Sponsor créé");
        setCreateOpen(false); setEdit(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  const onDelete = () => {
    if (!del) return;
    startTransition(async () => {
      const res = await deletePartnerAdminAction(del.id);
      if (res.ok) {
        toast.success("Sponsor supprimé"); setDel(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Sponsors" subtitle="Gestion des sponsors de Baarako." />
      <Button onClick={() => setCreateOpen(true)}>Nouveau sponsor</Button>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 uppercase text-xs">
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Contact</th>
              <th className="p-3 text-center">Ordre</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-xs text-slate-500">{p.website || "—"}</td>
                <td className="p-3 text-center">{p.display_order}</td>
                <td className="p-3 text-right">
                    <Button variant="ghost" onClick={() => setEdit(p)}>✏️</Button>
                    <Button variant="ghost" onClick={() => setDel(p)}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <AdminModal open={createOpen} onOpenChange={setCreateOpen} title="Ajout" footer={<Button type="submit" form="p-add">Créer</Button>}><form id="p-add" onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}><SponsorFields /></form></AdminModal>
      <AdminModal open={!!edit} onOpenChange={(o) => !o && setEdit(null)} title="Modifier" footer={<Button type="submit" form="p-edit">Enregistrer</Button>}><form id="p-edit" onSubmit={(e) => { e.preventDefault(); edit && onSubmit(new FormData(e.currentTarget), edit.id); }}><SponsorFields sponsor={edit ?? undefined} /></form></AdminModal>
      <ConfirmDeleteModal open={!!del} onOpenChange={(o) => !o && setDel(null)} onConfirm={onDelete} pending={isPending} title="Supprimer sponsor ?" />
    </div>
  );
}
