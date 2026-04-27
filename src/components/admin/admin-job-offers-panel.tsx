"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  createJobOfferAction,
  deleteJobOfferAction,
  updateJobOfferAction
} from "@/controllers/job-offer.controller";
import type { JobOfferWithCompany } from "@/models";
import { AdminModal } from "@/components/admin/admin-modal";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { AdminJobApplicationDetailsModal } from "@/components/modals/admin-job-application-details-modal";

function OfferFields({ offer }: { offer?: JobOfferWithCompany }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Titre de la bourse</label>
        <input name="title" required className="input-field mt-1 w-full" defaultValue={offer?.title ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea name="description" rows={3} className="input-field mt-1 w-full" defaultValue={offer?.description ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Type de bourse</label>
        <select name="type_bourse" className="input-field mt-1 w-full" defaultValue={offer?.type_bourse ?? "regular"}>
          <option value="regular">Régulière</option>
          <option value="tchakeda">Tchakèda</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Image</label>
        <input type="file" name="image" accept="image/*" className="input-field mt-1 w-full" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Statut</label>
        <select name="status" className="input-field mt-1 w-full" defaultValue={offer?.status ?? "draft"}>
          <option value="draft">Brouillon</option>
          <option value="published">Publiée</option>
          <option value="closed">Fermée</option>
        </select>
      </div>
    </div>
  );
}

export function AdminJobOffersPanel({ offers }: { offers: JobOfferWithCompany[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<JobOfferWithCompany | null>(null);
  const [del, setDel] = useState<JobOfferWithCompany | null>(null);
  const [viewApp, setViewApp] = useState<JobOfferWithCompany | null>(null);

  const onSubmit = async (fd: FormData, id?: string) => {
    // Note: Utiliser FormData directement pour la création (gère le fichier)
    startTransition(async () => {
      const res = id ? await updateJobOfferAction(id, fd) : await createJobOfferAction(fd);
      if (res.ok) {
        toast.success(id ? "Bourse mise à jour" : "Bourse créée");
        setCreateOpen(false); setEdit(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  const onDelete = () => {
    if (!del) return;
    startTransition(async () => {
      const res = await deleteJobOfferAction(del.id);
      if (res.ok) {
        toast.success("Bourse supprimée"); setDel(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Bourses" subtitle="Gérez vos bourses indépendantes." />
      <Button onClick={() => setCreateOpen(true)}>Nouvelle bourse</Button>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 uppercase text-xs">
            <tr><th className="p-3">Titre</th><th className="p-3">Type</th><th className="p-3 text-center">Candidatures</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.title}</td>
                <td className="p-3"><Badge>{o.type_bourse}</Badge></td>
                <td className="p-3 text-center">
                    {o.applications_count ?? 0}
                    {o.applications_count ? <Button variant="ghost" size="sm" onClick={() => setViewApp(o)}>📋</Button> : null}
                </td>
                <td className="p-3 text-right">
                    <Button variant="ghost" onClick={() => setEdit(o)}>✏️</Button>
                    <Button variant="ghost" onClick={() => setDel(o)}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      
      <AdminModal open={createOpen} onOpenChange={setCreateOpen} title="Nouvelle bourse" footer={<Button type="submit" form="f-add">Créer</Button>}><form id="f-add" onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}><OfferFields /></form></AdminModal>
      <AdminModal open={!!edit} onOpenChange={(o) => !o && setEdit(null)} title="Modifier" footer={<Button type="submit" form="f-edit">Enregistrer</Button>}><form id="f-edit" onSubmit={(e) => { e.preventDefault(); edit && onSubmit(new FormData(e.currentTarget), edit.id); }}><OfferFields offer={edit ?? undefined} /></form></AdminModal>
      <ConfirmDeleteModal open={!!del} onOpenChange={(o) => !o && setDel(null)} onConfirm={onDelete} pending={isPending} title="Supprimer bourse ?" />
      {viewApp && <AdminJobApplicationDetailsModal jobOfferId={viewApp.id} jobOfferTitle={viewApp.title} open={!!viewApp} onOpenChange={(o) => !o && setViewApp(null)} />}
    </div>
  );
}
