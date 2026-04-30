import Link from "next/link";
import Image from "next/image"; // Import Image component
import { listPublishedOffersAction } from "@/controllers/job-offer.controller";
import { createClientOptional } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InteractiveButton } from "@/components/ui/interactive-button";

export default async function OffresPage() {
  const supabase = await createClientOptional();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Card>
          <p className="text-sm text-slate-600">Supabase non configuré.</p>
        </Card>
      </div>
    );
  }
  const res = await listPublishedOffersAction();
  const offers = res.ok ? res.data : [];

  // Logo colors
  const primaryOrange = "#F57C00"; // Main orange
  const darkBlue = "#0D47A1";     // Dark blue
  const lightOrange = "#FFA726";  // Light orange
  const darkGreen = "#2E8B57";    // Dark green
  const yellowGold = "#FFD54F";   // Yellow/Gold

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-6 overflow-hidden" style={{ backgroundColor: '#f8fafc' /* Light gray background */ }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-40" style={{ background: `radial-gradient(circle, ${lightOrange}, transparent 70%)` }}/>
      <div className="absolute bottom-0 right-0 w-96 h-96 translate-x-1/2 translate-y-1/2 rounded-full blur-3xl opacity-40" style={{ background: `radial-gradient(circle, ${darkGreen}, transparent 70%)` }}/>

      {/* Hero Section */}
      <div
        className="mb-8 rounded-xl py-16 px-6 flex flex-col items-center justify-center text-center relative z-10"
        style={{
          background: `linear-gradient(to right, ${primaryOrange}80, ${darkGreen}80)`, /* Gradient using logo colors with opacity */
          boxShadow: '0 12px 40px -16px rgba(12,74,110,0.12)' /* Subtle shadow */
        }}
      >
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl" style={{ color: 'white' }}>
          Bourse Baarako — Bourses d'Emploi
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90">
          {offers.length} offre{offers.length > 1 ? "s" : ""} publiée{offers.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 relative z-10">
        {offers.map((o) => (
          <Card key={o.id} glowing className="flex flex-col" style={{ borderColor: primaryOrange, backgroundColor: '#ffffff' /* White background for cards */ }}>
            <div className="flex items-start justify-between gap-2">
              {/* Image de la bourse */}
              {o.image_url ? (
                <Image
                  src={o.image_url}
                  alt={o.title}
                  width={200}
                  height={120}
                  className="h-24 w-full rounded-lg object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="flex h-24 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-400">
                  Pas d'image
                </div>
              )}
            </div>
            <h2 className="mt-3 font-display text-lg font-semibold text-slate-900" style={{ color: darkBlue }}>
              {o.title}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {o.sector && <Badge variant="gold" style={{ backgroundColor: yellowGold, color: darkBlue }}>{o.sector}</Badge>}
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {o.salary_min != null && o.salary_max != null
                ? `${o.salary_min.toLocaleString()} – ${o.salary_max.toLocaleString()} ${o.currency}/mois`
                : "Rémunération à discuter"}
            </p>
            <div className="mt-auto pt-6">
              <InteractiveButton href={`/bourses/${o.id}`} primaryOrange={primaryOrange} />
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
