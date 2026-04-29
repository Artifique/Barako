"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AdminModal } from "@/components/admin/admin-modal";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/models";
import { updateProfileAdminAction, deleteUserAdminAction } from "@/controllers/admin.controller";
import { createUserAdminAction } from "@/controllers/profile.controller";

function UserFields({ profile }: { profile?: Profile }) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-700">Nom complet</label>
        <input name="full_name" required className="input-field mt-1 w-full" defaultValue={profile?.full_name ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Email</label>
        <input name="email" type="email" required className="input-field mt-1 w-full" defaultValue={profile?.email ?? ""} disabled={!!profile} />
      </div>
      {!profile && (
        <div>
          <label className="text-xs font-semibold text-slate-700">Mot de passe</label>
          <input name="password" type="password" required className="input-field mt-1 w-full" />
        </div>
      )}
      <div>
        <label className="text-xs font-semibold text-slate-700">Rôle</label>
        <select name="role" className="input-field mt-1 w-full" defaultValue={profile?.role ?? "job_seeker"}>
          <option value="job_seeker">Chercheur d'emploi</option>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="company">Entreprise</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
    </div>
  );
}

export function AdminUtilisateursPanel({ users }: { users: Profile[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<Profile | null>(null);
  const [del, setDel] = useState<Profile | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const onSubmit = async (fd: FormData, id?: string) => {
    const input = {
      full_name: String(fd.get("full_name")),
      role: String(fd.get("role")),
      email: String(fd.get("email")),
      password: String(fd.get("password") || "")
    };
    startTransition(async () => {
      const res = id ? await updateProfileAdminAction(id, { full_name: input.full_name, role: input.role as any }) : await createUserAdminAction(input);
      if (res.ok) {
        toast.success(id ? "Utilisateur mis à jour" : "Utilisateur créé");
        setCreateOpen(false); setEdit(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  const onDelete = () => {
    if (!del) return;
    startTransition(async () => {
      const res = await deleteUserAdminAction(del.id);
      if (res.ok) {
        toast.success("Utilisateur supprimé"); setDel(null); router.refresh();
      } else toast.error(res.error);
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Utilisateurs" subtitle="Gestion des comptes utilisateurs." />
      <Button onClick={() => setCreateOpen(true)}>Nouvel utilisateur</Button>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 uppercase text-xs">
            <tr><th className="p-3">Nom</th><th className="p-3">Email</th><th className="p-3 text-center">Rôle</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-medium">{u.full_name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-center"><Badge>{u.role}</Badge></td>
                <td className="p-3 text-right">
                  <Button variant="ghost" onClick={() => setEdit(u)}>✏️</Button>
                  <Button variant="ghost" onClick={() => setDel(u)}>🗑️</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex gap-2 border-t">
          <Button disabled={page === 1} onClick={() => setPage(page-1)}>Précédent</Button>
          <Button disabled={page * itemsPerPage >= users.length} onClick={() => setPage(page+1)}>Suivant</Button>
        </div>
      </Card>
      <AdminModal open={createOpen} onOpenChange={setCreateOpen} title="Ajout" footer={<Button type="submit" form="u-add">Créer</Button>}><form id="u-add" onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}><UserFields /></form></AdminModal>
      <AdminModal open={!!edit} onOpenChange={(o) => !o && setEdit(null)} title="Modifier" footer={<Button type="submit" form="u-edit">Enregistrer</Button>}><form id="u-edit" onSubmit={(e) => { e.preventDefault(); edit && onSubmit(new FormData(e.currentTarget), edit.id); }}><UserFields profile={edit ?? undefined} /></form></AdminModal>
      <ConfirmDeleteModal open={!!del} onOpenChange={(o) => !o && setDel(null)} onConfirm={onDelete} pending={isPending} title="Supprimer utilisateur ?" />
    </div>
  );
}
