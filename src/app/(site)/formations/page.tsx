import { listFormationsAction } from "@/controllers/formation.controller";
import { createClientOptional } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { FormationTile } from "@/components/sections/formation-tile";

export default async function FormationsPage() {
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
  const res = await listFormationsAction();
  const formations = res.ok ? res.data : [];
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Logo colors
  const primaryOrange = "#F57C00"; // Main orange
  const darkBlue = "#0D47A1";     // Dark blue
  const lightOrange = "#FFA726";  // Light orange
  const darkGreen = "#2E8B57";    // Dark green
  const yellowGold = "#FFD54F";   // Yellow/Gold

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-6 overflow-hidden" style={{ backgroundColor: '#f0f4f8' /* A subtle light blue-gray background */ }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(circle, ${primaryOrange}80, transparent 70%)` }}/>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 translate-x-1/2 translate-y-1/2 rounded-full blur-2xl opacity-20" style={{ background: `radial-gradient(circle, ${darkGreen}, transparent 70%)` }}/>

      <header className="relative mx-auto max-w-3xl text-center z-10">
        {/* Eyebrow text using a green tone */}
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: darkGreen }}>
          Parcours certifiants
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-[2.65rem] md:leading-[1.1]">
          Formations{" "}
          {/* Heading gradient using orange and blue */}
          <span
            className="bg-clip-text text-transparent"
            style={{
              background: `linear-gradient(to right, ${primaryOrange}, ${darkBlue})`,
            }}
          >
            employabilité & entrepreneuriat
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-700">
          Sessions courtes, centrées sur l’emploi et la structuration de projet — dates, lieux et places mis à jour en
          temps réel.
        </p>
      </header>

      <div className="relative mt-14 grid gap-7 md:grid-cols-2 z-10">
        {formations.map((f) => (
          <FormationTile key={f.id} f={f} isAuthenticated={!!user} />
        ))}
      </div>

      {formations.length === 0 && (
        <Card glowing className="relative mx-auto mt-12 max-w-lg text-center" style={{ borderColor: primaryOrange }}>
          <p className="text-sm leading-relaxed text-slate-600">
            Nous préparons actuellement de nouvelles sessions de formation. Veuillez revenir consulter cette page très prochainement.
          </p>
        </Card>
      )}
    </div>
  );
}
