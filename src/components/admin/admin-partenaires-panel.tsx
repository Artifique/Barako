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
import { uploadFileToSupabase } from "@/lib/utils/supabase-upload";
import { createClient } from "@/lib/supabase/client";

function SponsorFields({ sponsor }: { sponsor?: Partner }) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-700">Nom</label>
        <input name="name" required className="input-field mt-1 w-full" defaultValue={sponsor?.name ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Logo</label>
        <input type="file" name="logo" accept="image/*" className="mt-1 w-full" />
        {sponsor?.logo_url && <img src={sponsor.logo_url} alt="Logo" className="mt-2 h-20" />}
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Contact (Site web/Email)</label>
        <input name="website" className="input-field mt-1 w-full" defaultValue={sponsor?.website ?? ""} />
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
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  const supabase = createClient();
  const paginatedSponsors = sponsors.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const onSubmit = async (fd: FormData, id?: string) => {
    const file = fd.get("logo") as File;
    let logo_url = id ? edit?.logo_url : null;

    if (file && file.size > 0) {
      const uploadRes = await uploadFileToSupabase(supabase, "bourse-images", file);
      if (!uploadRes.ok) return toast.error("Erreur upload logo");
      logo_url = uploadRes.data?.url || null;
    }

    const input = {
      name: String(fd.get("name")),
      logo_url: logo_url || undefined,
      website: String(fd.get("website") || ""),
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
            <tr><th className="p-3">Logo</th><th className="p-3">Nom</th><th className="p-3">Contact</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {paginatedSponsors.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3"><img src={p.logo_url || ""} alt="" className="h-8 w-8 object-contain" /></td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-xs text-slate-500">{p.website || "—"}</td>
                <td className="p-3 text-right">
                    <Button variant="ghost" onClick={() => setEdit(p)}>✏️</Button>
                    <Button variant="ghost" onClick={() => setDel(p)}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex gap-2">
            <Button disabled={page === 1} onClick={() => setPage(page-1)}>Précédent</Button>
            <Button disabled={page * itemsPerPage >= sponsors.length} onClick={() => setPage(page+1)}>Suivant</Button>
        </div>
      </Card>
      <AdminModal open={createOpen} onOpenChange={setCreateOpen} title="Ajout" footer={<Button type="submit" form="p-add">Créer</Button>}><form id="p-add" onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}><SponsorFields /></form></AdminModal>
      <AdminModal open={!!edit} onOpenChange={(o) => !o && setEdit(null)} title="Modifier" footer={<Button type="submit" form="p-edit">Enregistrer</Button>}><form id="p-edit" onSubmit={(e) => { e.preventDefault(); edit && onSubmit(new FormData(e.currentTarget), edit.id); }}><SponsorFields sponsor={edit ?? undefined} /></form></AdminModal>
      <ConfirmDeleteModal open={!!del} onOpenChange={(o) => !o && setDel(null)} onConfirm={onDelete} pending={isPending} title="Supprimer sponsor ?" />
    </div>
  );
}
