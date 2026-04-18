import Link from "next/link";
import { listPublishedOffersAction } from "@/controllers/job-offer.controller";
import { createClientOptional } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function OffresPage() {
  const supabase = await createClientOptional();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Card>
          <p className="text-sm text-text-muted">
            Configure <code className="font-mono text-secondary">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
            <code className="font-mono text-secondary">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> pour afficher les
            offres.
          </p>
        </Card>
      </div>
    );
  }
  const res = await listPublishedOffersAction();
  const offers = res.ok ? res.data : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Bourse Baarako — Offres</h1>
        <p className="mt-2 text-slate-600">
          {offers.length} offre{offers.length > 1 ? "s" : ""} publiée{offers.length > 1 ? "s" : ""}
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => (
          <Card key={o.id} glowing className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500">{o.companies?.name ?? "Entreprise"}</p>
                <p className="text-xs text-slate-500">{o.location}</p>
              </div>
              {o.companies?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.companies.logo_url} alt="" className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-medium text-slate-400">
                  LOGO
                </div>
              )}
            </div>
            <h2 className="mt-3 font-display text-lg font-semibold text-slate-900">{o.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="info">{o.contract_type}</Badge>
              {o.sector && <Badge variant="gold">{o.sector}</Badge>}
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {o.salary_min != null && o.salary_max != null
                ? `${o.salary_min.toLocaleString()} – ${o.salary_max.toLocaleString()} ${o.currency}/mois`
                : "Rémunération à discuter"}
            </p>
            <div className="mt-auto pt-6">
              <Link href={`/offres/${o.id}`}>
                <Button variant="outline" className="w-full">
                  Voir détails
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
      {offers.length === 0 && (
        <Card className="mt-6">
          <p className="text-sm text-slate-600">
            Aucune offre publiée pour l’instant. Crée une entreprise, puis une offre (statut « published ») depuis
            le compte entreprise ou l’admin.
          </p>
        </Card>
      )}
    </div>
  );
}
