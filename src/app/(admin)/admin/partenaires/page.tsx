import { redirect } from "next/navigation";
import { createPartnerAdminAction } from "@/controllers/partner.controller";
import { createClient } from "@/lib/supabase/server";
import * as PartnerService from "@/services/partner.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function createPartner(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/admin/partenaires?err=" + encodeURIComponent("Nom requis."));
  const res = await createPartnerAdminAction({
    name,
    description: String(formData.get("description") || "") || null,
    website: String(formData.get("website") || "") || null,
    display_order: Number(formData.get("display_order") || 0)
  });
  if (!res.ok) redirect("/admin/partenaires?err=" + encodeURIComponent(res.error));
  redirect("/admin/partenaires?ok=1");
}

type Props = { searchParams?: Record<string, string | string[] | undefined> };

export default async function AdminPartenairesPage({ searchParams }: Props) {
  const supabase = await createClient();
  const res = await PartnerService.listPartners(supabase);
  const partners = res.ok ? res.data : [];

  const err = typeof searchParams?.err === "string" ? searchParams.err : undefined;
  const ok = searchParams?.ok === "1";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Partenaires</h1>
        <p className="mt-1 text-sm text-slate-600">Logos et textes affichés sur la vitrine institutionnelle.</p>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{decodeURIComponent(err)}</div>
      )}
      {ok && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Partenaire ajouté.
        </div>
      )}

      <Card glowing>
        <h2 className="font-display text-lg font-semibold text-slate-900">Ajouter un partenaire</h2>
        <form action={createPartner} className="mt-4 grid max-w-xl gap-3">
          <input name="name" required placeholder="Nom du partenaire" className="input-field" />
          <textarea name="description" rows={2} placeholder="Description courte" className="input-field" />
          <input name="website" placeholder="Site web (URL)" className="input-field" />
          <input name="display_order" type="number" defaultValue={0} className="input-field" />
          <Button type="submit">Enregistrer</Button>
        </form>
      </Card>

      <Card glowing>
        <h2 className="font-display text-lg font-semibold text-slate-900">Liste</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {partners.map((p) => (
            <li key={p.id} className="flex flex-wrap items-start justify-between gap-4 py-4">
              <div>
                <p className="font-semibold text-slate-900">{p.name}</p>
                {p.description && <p className="mt-1 max-w-xl text-sm text-slate-600">{p.description}</p>}
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                ordre {p.display_order}
              </span>
            </li>
          ))}
          {partners.length === 0 && <li className="py-6 text-center text-slate-500">Aucun partenaire.</li>}
        </ul>
      </Card>
    </div>
  );
}
