"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createProjectAction, deleteProjectAdminAction, updateProjectAdminAction } from "@/controllers/project.controller";
import { AdminModal } from "@/components/admin/admin-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/models/project";

function ProjectFields({ project }: { project?: Project }) {
  return (
    <div className="grid gap-3">
      <div>
        <label className="text-xs font-semibold text-slate-700">Titre</label>
        <input name="title" required className="input-field mt-1 w-full" defaultValue={project?.title ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Secteur</label>
        <input name="sector" required className="input-field mt-1 w-full" defaultValue={project?.sector ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Description courte</label>
        <input name="short_description" className="input-field mt-1 w-full" defaultValue={project?.short_description ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Description complète</label>
        <textarea name="description" rows={3} className="input-field mt-1 w-full" defaultValue={project?.description ?? ""} />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="needs_mentoring" defaultChecked={project?.needs_mentoring} /> Mentorat</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="needs_funding" defaultChecked={project?.needs_funding} /> Financement</label>
      </div>
    </div>
  );
}

export function AdminProjetsPanel({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<Project | null>(null);
  const [del, setDel] = useState<Project | null>(null);

  const onSubmit = async (fd: FormData, id?: string) => {
    const data = {
      title: String(fd.get("title")),
      sector: String(fd.get("sector")),
      short_description: String(fd.get("short_description") || ""),
      description: String(fd.get("description") || ""),
      needs_mentoring: fd.get("needs_mentoring") === "on",
      needs_funding: fd.get("needs_funding") === "on",
    };
    startTransition(async () => {
      const res = id ? await updateProjectAdminAction(id, data) : await createProjectAction(data);
      if (res.ok) {
        toast.success(id ? "Projet mis à jour" : "Projet créé");
        setCreateOpen(false); setEdit(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  const onDelete = () => {
    if (!del) return;
    startTransition(async () => {
      const res = await deleteProjectAdminAction(del.id);
      if (res.ok) {
        toast.success("Projet supprimé"); setDel(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Projets" subtitle="Gestion des projets des entrepreneurs." />
      <Button onClick={() => setCreateOpen(true)}>Nouveau projet</Button>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 uppercase text-xs">
            <tr>
              <th className="p-3">Titre</th>
              <th className="p-3">Secteur</th>
              <th className="p-3">Mentorat</th>
              <th className="p-3">Financement</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3">{p.sector}</td>
                <td className="p-3">{p.needs_mentoring ? "✅" : "—"}</td>
                <td className="p-3">{p.needs_funding ? "✅" : "—"}</td>
                <td className="p-3"><Badge>{p.status}</Badge></td>
                <td className="p-3 text-right">
                  <Button variant="ghost" onClick={() => setEdit(p)}>✏️</Button>
                  <Button variant="ghost" onClick={() => setDel(p)}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <AdminModal open={createOpen} onOpenChange={setCreateOpen} title="Nouveau" footer={<Button type="submit" form="add-proj">Créer</Button>}><form id="add-proj" onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}><ProjectFields /></form></AdminModal>
      <AdminModal open={!!edit} onOpenChange={(o) => !o && setEdit(null)} title="Modifier" footer={<Button type="submit" form="edit-proj">Enregistrer</Button>}><form id="edit-proj" onSubmit={(e) => { e.preventDefault(); edit && onSubmit(new FormData(e.currentTarget), edit.id); }}><ProjectFields project={edit ?? undefined} /></form></AdminModal>
      <ConfirmDeleteModal open={!!del} onOpenChange={(o) => !o && setDel(null)} onConfirm={onDelete} pending={isPending} title="Supprimer projet ?" />
    </div>
  );
}
