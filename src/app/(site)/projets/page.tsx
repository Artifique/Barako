import { listProjectsCatalogAction } from "@/controllers/project.controller";
import { createClientOptional } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectSubmitForm } from "@/components/forms/project-submit-form";

export default async function ProjetsPage() {
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
  const res = await listProjectsCatalogAction();
  const projects = res.ok ? res.data : [];
  const {
    data: { user }
  } = await supabase.auth.getUser();
  let role: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = data?.role ?? null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-slate-900">Bourse Tchakèda — Projets</h1>
      <p className="mt-2 text-slate-600">Projets soumis par les jeunes entrepreneurs.</p>

      {user && role === "entrepreneur" && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold text-slate-900">Soumettre un projet</h2>
          <ProjectSubmitForm />
        </div>
      )}

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} glowing>
            <Badge variant="gold">{p.sector}</Badge>
            <h2 className="mt-3 font-display text-lg font-semibold text-slate-900">{p.title}</h2>
            <p className="mt-1 text-xs text-slate-500">par {p.profiles?.full_name ?? "—"}</p>
            <p className="mt-3 line-clamp-3 text-sm text-slate-600">{p.short_description ?? p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.needs_mentoring && <Badge variant="success">Mentorat</Badge>}
              {p.needs_funding && <Badge variant="warning">Financement</Badge>}
            </div>
            <p className="mt-3 text-xs text-slate-500">Statut : {p.status}</p>
          </Card>
        ))}
      </div>

      {!user && (
        <Card className="mt-8">
          <p className="text-sm text-slate-600">
            Connecte-toi avec le rôle « entrepreneur » pour soumettre un projet.
          </p>
        </Card>
      )}
    </div>
  );
}
