"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createJobOfferAction,
  deleteJobOfferAction,
  updateJobOfferAction
} from "@/controllers/job-offer.controller";
import type { Company, JobOfferStatus, JobOfferWithCompany } from "@/models";
import { AdminModal } from "@/components/admin/admin-modal";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const statuses: JobOfferStatus[] = ["draft", "published", "closed"];

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function OfferFields({
  companies,
  defaultCompanyId,
  offer
}: {
  companies: Company[];
  defaultCompanyId?: string;
  offer?: JobOfferWithCompany;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Entreprise</label>
          <select
            name="company_id"
            required
            defaultValue={offer?.company_id ?? defaultCompanyId ?? ""}
            className="input-field mt-1"
          >
            <option value="">— Choisir —</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Intitulé du poste</label>
          <input
            name="title"
            required
            defaultValue={offer?.title ?? ""}
            className="input-field mt-1"
            placeholder="Ex. Chargé de communication"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Type de contrat</label>
          <input name="contract_type" className="input-field mt-1" defaultValue={offer?.contract_type ?? "CDI"} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Lieu</label>
          <input name="location" className="input-field mt-1" defaultValue={offer?.location ?? "Bamako, Mali"} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Secteur</label>
          <input name="sector" className="input-field mt-1" defaultValue={offer?.sector ?? ""} placeholder="Optionnel" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Statut</label>
          <select name="status" className="input-field mt-1" defaultValue={offer?.status ?? "draft"}>
            <option value="draft">Brouillon</option>
            <option value="published">Publiée</option>
            <option value="closed">Fermée</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Salaire min (FCFA)</label>
          <input
            name="salary_min"
            type="number"
            className="input-field mt-1"
            defaultValue={offer?.salary_min ?? ""}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700">Salaire max (FCFA)</label>
          <input
            name="salary_max"
            type="number"
            className="input-field mt-1"
            defaultValue={offer?.salary_max ?? ""}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Expiration</label>
          <input
            name="expires_at"
            type="datetime-local"
            className="input-field mt-1"
            defaultValue={toDatetimeLocalValue(offer?.expires_at ?? null)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Description</label>
          <textarea name="description" rows={3} className="input-field mt-1" defaultValue={offer?.description ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Missions</label>
          <textarea name="missions" rows={2} className="input-field mt-1" defaultValue={offer?.missions ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Profil recherché</label>
          <textarea
            name="requirements"
            rows={2}
            className="input-field mt-1"
            defaultValue={offer?.requirements ?? ""}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Avantages</label>
          <textarea name="benefits" rows={2} className="input-field mt-1" defaultValue={offer?.benefits ?? ""} />
        </div>
      </div>
    </>
  );
}

export function AdminJobOffersPanel({
  offers: initialOffers,
  companies
}: {
  offers: JobOfferWithCompany[];
  companies: Company[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOffer, setEditOffer] = useState<JobOfferWithCompany | null>(null);
  const [deleteOffer, setDeleteOffer] = useState<JobOfferWithCompany | null>(null);
  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const readOfferForm = (form: FormData) => {
    const title = String(form.get("title") ?? "").trim();
    const companyId = String(form.get("company_id") ?? "");
    const salMin = form.get("salary_min");
    const salMax = form.get("salary_max");
    const expires = form.get("expires_at");
    const rawStatus = String(form.get("status") || "draft");
    const status = statuses.includes(rawStatus as JobOfferStatus) ? (rawStatus as JobOfferStatus) : "draft";
    return {
      company_id: companyId,
      title,
      description: String(form.get("description") || "") || null,
      missions: String(form.get("missions") || "") || null,
      requirements: String(form.get("requirements") || "") || null,
      benefits: String(form.get("benefits") || "") || null,
      contract_type: String(form.get("contract_type") || "CDI").trim(),
      sector: String(form.get("sector") || "") || null,
      location: String(form.get("location") || "Bamako, Mali"),
      salary_min: salMin ? Number(salMin) : null,
      salary_max: salMax ? Number(salMax) : null,
      currency: "XOF" as const,
      expires_at: expires ? String(expires) : null,
      status
    };
  };

  const onCreate = (formData: FormData) => {
    const payload = readOfferForm(formData);
    if (!payload.title || !payload.company_id) {
      setBanner({ type: "err", text: "Titre et entreprise requis." });
      return;
    }
    startTransition(async () => {
      const res = await createJobOfferAction(payload);
      if (!res.ok) {
        setBanner({ type: "err", text: res.error });
        return;
      }
      setBanner({ type: "ok", text: "Offre créée avec succès." });
      setCreateOpen(false);
      router.refresh();
    });
  };

  const onUpdate = (formData: FormData) => {
    if (!editOffer) return;
    const payload = readOfferForm(formData);
    if (!payload.title || !payload.company_id) {
      setBanner({ type: "err", text: "Titre et entreprise requis." });
      return;
    }
    startTransition(async () => {
      const res = await updateJobOfferAction(editOffer.id, payload);
      if (!res.ok) {
        setBanner({ type: "err", text: res.error });
        return;
      }
      setBanner({ type: "ok", text: "Offre mise à jour." });
      setEditOffer(null);
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!deleteOffer) return;
    startTransition(async () => {
      const res = await deleteJobOfferAction(deleteOffer.id);
      if (!res.ok) {
        setBanner({ type: "err", text: res.error });
        return;
      }
      setBanner({ type: "ok", text: "Offre supprimée." });
      setDeleteOffer(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6 text-slate-900">
      <AdminPageHeader
        title="Offres d’emploi"
        subtitle="Création, modification et suppression des offres pour les entreprises référencées."
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
          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={() => setBanner(null)}
          >
            Fermer
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={() => setCreateOpen(true)} disabled={isPending}>
          Nouvelle offre
        </Button>
        {companies.length === 0 ? (
          <p className="self-center text-sm text-slate-600">
            Aucune entreprise enregistrée : la fenêtre « Nouvelle offre » vous indiquera la marche à suivre. Créez une
            fiche dans{" "}
            <Link href="/admin/entreprises" className="font-semibold text-primary underline">
              Entreprises
            </Link>
            .
          </p>
        ) : null}
      </div>

      <Card glowing className="overflow-x-auto border-slate-200/90 shadow-md shadow-slate-200/30">
        <h2 className="font-display text-lg font-semibold text-slate-900">Toutes les offres</h2>
        <p className="mt-1 text-sm text-slate-600">Actions rapides depuis le tableau.</p>
        <table className="mt-4 w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="border-b border-slate-200 bg-slate-50/80 p-3">Titre</th>
              <th className="border-b border-slate-200 bg-slate-50/80 p-3">Entreprise</th>
              <th className="border-b border-slate-200 bg-slate-50/80 p-3">Lieu</th>
              <th className="border-b border-slate-200 bg-slate-50/80 p-3">Statut</th>
              <th className="border-b border-slate-200 bg-slate-50/80 p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialOffers.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 hover:bg-sky-50/40">
                <td className="p-3 font-medium text-slate-900">{o.title}</td>
                <td className="p-3 text-slate-700">{o.companies?.name ?? "—"}</td>
                <td className="p-3 text-slate-600">{o.location}</td>
                <td className="p-3">
                  <Badge variant="gold">{o.status}</Badge>
                </td>
                <td className="p-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditOffer(o)}>
                      Modifier
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => setDeleteOffer(o)}>
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialOffers.length === 0 && (
          <p className="mt-6 text-center text-sm text-slate-600">Aucune offre pour le moment.</p>
        )}
      </Card>

      <AdminModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Nouvelle offre"
        description={
          companies.length === 0
            ? "Une entreprise référencée est nécessaire avant de publier une offre."
            : "Renseignez les informations de publication."
        }
        size="lg"
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Fermer
            </Button>
            {companies.length > 0 ? (
              <Button type="submit" form="admin-offer-create" disabled={isPending}>
                {isPending ? "Enregistrement…" : "Créer l’offre"}
              </Button>
            ) : null}
          </div>
        }
      >
        {companies.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
            <p className="font-semibold">Étape préalable</p>
            <p className="mt-2 leading-relaxed text-amber-900/90">
              Ajoutez au moins une entreprise (avec un compte propriétaire rôle « entreprise ») depuis la page{" "}
              <Link href="/admin/entreprises" className="font-bold text-primary underline" onClick={() => setCreateOpen(false)}>
                Entreprises
              </Link>
              . Vous pourrez ensuite rattacher chaque offre à cette entreprise.
            </p>
          </div>
        ) : (
          <form
            id="admin-offer-create"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onCreate(new FormData(e.currentTarget));
            }}
          >
            <OfferFields companies={companies} />
          </form>
        )}
      </AdminModal>

      <AdminModal
        open={!!editOffer}
        onOpenChange={(o) => !o && setEditOffer(null)}
        title="Modifier l’offre"
        description={editOffer ? editOffer.title : undefined}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEditOffer(null)}>
              Annuler
            </Button>
            <Button type="submit" form="admin-offer-edit" disabled={isPending}>
              {isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        }
      >
        {editOffer ? (
          <form
            key={editOffer.id}
            id="admin-offer-edit"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdate(new FormData(e.currentTarget));
            }}
          >
            <OfferFields companies={companies} offer={editOffer} />
          </form>
        ) : null}
      </AdminModal>

      <AdminModal
        open={!!deleteOffer}
        onOpenChange={(o) => !o && setDeleteOffer(null)}
        title="Supprimer cette offre ?"
        description={deleteOffer ? `« ${deleteOffer.title} » sera retirée définitivement.` : undefined}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDeleteOffer(null)}>
              Annuler
            </Button>
            <Button type="button" variant="secondary" disabled={isPending} onClick={onDelete}>
              {isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-700">
          Les candidatures associées seront supprimées en cascade. Cette action est irréversible.
        </p>
      </AdminModal>
    </div>
  );
}
