import { redirect } from "next/navigation";
import { listCompaniesAdminAction, createCompanyAsAdminAction } from "@/controllers/company.controller";
import { listUsersAdminAction } from "@/controllers/profile.controller";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function createCompanyAdmin(formData: FormData) {
  "use server";
  const ownerId = String(formData.get("owner_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!ownerId || !name) redirect("/admin/entreprises?err=" + encodeURIComponent("Propriétaire et nom requis."));
  const res = await createCompanyAsAdminAction(ownerId, {
    name,
    location: String(formData.get("location") || "") || null,
    website: String(formData.get("website") || "") || null,
    description: String(formData.get("description") || "") || null
  });
  if (!res.ok) redirect("/admin/entreprises?err=" + encodeURIComponent(res.error));
  redirect("/admin/entreprises?ok=1");
}

type Props = { searchParams?: Record<string, string | string[] | undefined> };

export default async function AdminEntreprisesPage({ searchParams }: Props) {
  const [companiesRes, ownersRes] = await Promise.all([
    listCompaniesAdminAction(),
    listUsersAdminAction({ role: "company", limit: 200 })
  ]);
  const companies = companiesRes.ok ? companiesRes.data : [];
  const companyOwners = ownersRes.ok ? ownersRes.data : [];

  const err = typeof searchParams?.err === "string" ? searchParams.err : undefined;
  const ok = searchParams?.ok === "1" || searchParams?.ok === "true";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Entreprises</h1>
        <p className="mt-1 text-sm text-slate-600">
          Associez une fiche entreprise à un compte utilisateur au rôle « entreprise » pour permettre la publication
          d’offres.
        </p>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{decodeURIComponent(err)}</div>
      )}
      {ok && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Entreprise enregistrée.
        </div>
      )}

      <Card glowing>
        <h2 className="font-display text-lg font-semibold text-slate-900">Nouvelle entreprise</h2>
        {companyOwners.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            Aucun utilisateur avec le rôle « company ». Invitez un utilisateur à s’inscrire avec ce rôle depuis la page
            inscription, ou adaptez son rôle en base.
          </p>
        ) : (
          <form action={createCompanyAdmin} className="mt-4 grid max-w-xl gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Compte propriétaire (rôle entreprise)</label>
              <select name="owner_id" required className="input-field mt-1">
                <option value="">— Choisir —</option>
                {companyOwners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name ?? p.email} ({p.email})
                  </option>
                ))}
              </select>
            </div>
            <input name="name" required placeholder="Raison sociale" className="input-field" />
            <input name="location" placeholder="Siège / ville" className="input-field" />
            <input name="website" placeholder="Site web" className="input-field" />
            <textarea name="description" rows={3} placeholder="Description" className="input-field" />
            <Button type="submit">Créer l’entreprise</Button>
          </form>
        )}
      </Card>

      <Card glowing>
        <h2 className="font-display text-lg font-semibold text-slate-900">Fiches existantes</h2>
        <ul className="mt-4 divide-y divide-slate-100 text-sm">
          {companies.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-semibold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">{c.location ?? "—"}</p>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{c.id.slice(0, 8)}…</span>
            </li>
          ))}
          {companies.length === 0 && <li className="py-6 text-center text-slate-500">Aucune entreprise.</li>}
        </ul>
      </Card>
    </div>
  );
}
