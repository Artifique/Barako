import { listFormationsAction } from "@/controllers/formation.controller";
import { createClientOptional } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormationRegisterButton } from "@/components/forms/formation-register-button";

export default async function FormationsPage() {
  const supabase = await createClientOptional();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Card>
          <p className="text-sm text-text-muted">Supabase non configuré.</p>
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-slate-900">Formations</h1>
      <p className="mt-2 text-slate-600">Parcours employabilité et entrepreneuriat.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {formations.map((f) => (
          <Card key={f.id} glowing>
            <Badge variant={f.type === "employability" ? "info" : "gold"}>
              {f.type === "employability" ? "Employabilité" : "Entrepreneuriat"}
            </Badge>
            <h2 className="mt-3 font-display text-xl font-semibold text-slate-900">{f.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{f.description}</p>
            <p className="mt-3 text-xs text-slate-500">
              {new Date(f.start_date).toLocaleDateString("fr-FR")}
              {f.end_date ? ` → ${new Date(f.end_date).toLocaleDateString("fr-FR")}` : ""} — {f.duration_days}{" "}
              jour(s) — {f.location}
            </p>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-teal-600 to-secondary transition-all"
                style={{ width: `${Math.min(100, (f.registered_count / Math.max(1, f.max_places)) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Places restantes : {f.places_left} / {f.max_places}
            </p>
            <FormationRegisterButton formationId={f.id} isAuthenticated={!!user} />
          </Card>
        ))}
      </div>
      {formations.length === 0 && (
        <Card className="mt-6">
          <p className="text-sm text-slate-600">Aucune formation pour le moment. Lance le seed SQL.</p>
        </Card>
      )}
    </div>
  );
}
