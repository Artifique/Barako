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

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-gradient-to-b from-[rgb(12_74_110_/_0.07)] via-teal-500/10 to-transparent blur-3xl" />

      <header className="relative mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-teal-700/90">Parcours certifiants</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-[2.65rem] md:leading-[1.1]">
          Formations{" "}
          <span className="bg-gradient-to-r from-primary via-teal-600 to-secondary bg-clip-text text-transparent">
            employabilité & entrepreneuriat
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">
          Sessions courtes, centrées sur l’emploi et la structuration de projet — dates, lieux et places mis à jour en
          temps réel.
        </p>
      </header>

      <div className="relative mt-14 grid gap-7 md:grid-cols-2">
        {formations.map((f) => (
          <FormationTile key={f.id} f={f} isAuthenticated={!!user} />
        ))}
      </div>

      {formations.length === 0 && (
        <Card glowing className="relative mx-auto mt-12 max-w-lg text-center">
          <p className="text-sm leading-relaxed text-slate-600">
            Aucune session pour le moment. Lance le script <span className="font-mono text-xs text-primary">seed.sql</span>{" "}
            dans Supabase pour afficher des exemples.
          </p>
        </Card>
      )}
    </div>
  );
}
