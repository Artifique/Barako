"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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

function FormationFields({ formation }: { formation?: Formation }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Titre</label>
        <input name="title" required className="input-field mt-1" defaultValue={formation?.title ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Type</label>
        <select name="type" className="input-field mt-1" defaultValue={formation?.type ?? "employability"}>
          <option value="employability">Employabilité</option>
          <option value="entrepreneurship">Entrepreneuriat</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Description</label>
        <textarea name="description" rows={3} className="input-field mt-1" defaultValue={formation?.description ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Date de début</label>
        <input type="date" name="start_date" required className="input-field mt-1" defaultValue={formation?.start_date ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Date de fin</label>
        <input type="date" name="end_date" className="input-field mt-1" defaultValue={formation?.end_date ?? ""} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Durée (jours)</label>
        <input name="duration_days" type="number" min={1} className="input-field mt-1" defaultValue={formation?.duration_days ?? 5} />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700">Places max</label>
        <input name="max_places" type="number" min={1} className="input-field mt-1" defaultValue={formation?.max_places ?? 25} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-700">Lieu</label>
        <input name="location" className="input-field mt-1" defaultValue={formation?.location ?? "Bamako"} />
      </div>
    </div>
  );
}

function readFormationForm(form: FormData) {
  const rawType = String(form.get("type"));
  const type = (FormationTypes as readonly string[]).includes(rawType) ? (rawType as FormationType) : "employability";
  return {
    title: String(form.get("title") ?? "").trim(),
    type,
    description: String(form.get("description") || "") || null,
    start_date: String(form.get("start_date")),
    end_date: String(form.get("end_date") || "") || null,
    duration_days: Number(form.get("duration_days") || 1),
    location: String(form.get("location") || "Bamako"),
    max_places: Number(form.get("max_places") || 30)
  };
}

export function AdminFormationsPanel({ formations: initial }: { formations: Formation[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<Formation | null>(null);
  const [del, setDel] = useState<Formation | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const onCreate = (fd: FormData) => {
    const input = readFormationForm(fd);
    if (!input.title || !input.start_date) {
      setBanner({ type: "err", text: "Titre et date de début requis." });
      return;
    }
    startTransition(async () => {
      const res = await createFormationAdminAction(input);
      if (!res.ok) {
        setBanner({ type: "err", text: res.error });
        return;
      }
      setBanner({ type: "ok", text: "Formation créée." });
      setCreateOpen(false);
      router.refresh();
    });
  };

  const onUpdate = (fd: FormData) => {
    if (!edit) return;
    const input = readFormationForm(fd);
    if (!input.title || !input.start_date) {
      setBanner({ type: "err", text: "Titre et date de début requis." });
      return;
    }
    startTransition(async () => {
      const res = await updateFormationAdminAction(edit.id, input);
      if (!res.ok) {
        setBanner({ type: "err", text: res.error });
        return;
      }
      setBanner({ type: "ok", text: "Formation mise à jour." });
      setEdit(null);
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!del) return;
    startTransition(async () => {
      const res = await deleteFormationAdminAction(del.id);
      if (!res.ok) {
        setBanner({ type: "err", text: res.error });
        return;
      }
      setBanner({ type: "ok", text: "Formation supprimée." });
      setDel(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6 text-slate-900">
      <AdminPageHeader
        title="Formations"
        subtitle="Création, modification et suppression des sessions affichées sur le site."
      />

      {banner && (
        <div
          className={
            banner.type === "err"
              ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
              : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          }
        >
          {banner.text}
          <button type="button" className="ml-3 font-semibold underline" onClick={() => setBanner(null)}>
            Fermer
          </button>
        </div>
      )}

      <Button type="button" onClick={() => setCreateOpen(true)} disabled={isPending}>
        Nouvelle formation
      </Button>

      <Card glowing className="border-slate-200/90 shadow-md shadow-slate-200/30">
        <h2 className="font-display text-lg font-semibold text-slate-900">Sessions</h2>
        <p className="mt-1 text-sm text-slate-600">Liste des formations et actions.</p>
        <ul className="mt-4 divide-y divide-slate-100 text-sm">
          {initial.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-2">
              <div>
                <p className="font-semibold text-slate-900">{f.title}</p>
                <p className="text-xs text-slate-600">
                  {f.type} — début {f.start_date}
                  {f.end_date ? ` → fin ${f.end_date}` : ""} — {f.location}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setEdit(f)}>
                  Modifier
                </Button>
                <Button type="button" size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => setDel(f)}>
                  Supprimer
                </Button>
              </div>
            </li>
          ))}
          {initial.length === 0 && <li className="py-8 text-center text-slate-600">Aucune formation.</li>}
        </ul>
      </Card>

      <AdminModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Nouvelle formation"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" form="admin-formation-create" disabled={isPending}>
              {isPending ? "Enregistrement…" : "Créer"}
            </Button>
          </div>
        }
      >
        <form
          id="admin-formation-create"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate(new FormData(e.currentTarget));
          }}
        >
          <FormationFields />
        </form>
      </AdminModal>

      <AdminModal
        open={!!edit}
        onOpenChange={(o) => !o && setEdit(null)}
        title="Modifier la formation"
        description={edit?.title}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEdit(null)}>
              Annuler
            </Button>
            <Button type="submit" form="admin-formation-edit" disabled={isPending}>
              {isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        }
      >
        {edit ? (
          <form
            key={edit.id}
            id="admin-formation-edit"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdate(new FormData(e.currentTarget));
            }}
          >
            <FormationFields formation={edit} />
          </form>
        ) : null}
      </AdminModal>

      <AdminModal
        open={!!del}
        onOpenChange={(o) => !o && setDel(null)}
        title="Supprimer cette formation ?"
        description={del ? `« ${del.title} » et les inscriptions associées seront supprimées.` : undefined}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDel(null)}>
              Annuler
            </Button>
            <Button type="button" variant="secondary" disabled={isPending} onClick={onDelete}>
              {isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-700">Cette action supprime aussi les lignes d’inscription liées (cascade).</p>
      </AdminModal>
    </div>
  );
}
