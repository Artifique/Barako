import Link from "next/link";
import { listProjectsCatalogAction } from "@/controllers/project.controller";
import { createClientOptional } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectSubmitForm } from "@/components/forms/project-submit-form";
import { ProjectTile } from "@/components/sections/project-tile";

export default async function ProjetsPage() {
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

  const canSubmit = user && role === "entrepreneur";
  const loggedNotEntrepreneur = user && role !== "entrepreneur";

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-6">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-gradient-to-bl from-[rgb(234_88_12_/_0.08)] via-amber-400/10 to-transparent blur-3xl" />

      <header className="relative mx-auto max-w-3xl text-center">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary/90">Bourse Tchakèda</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-[2.65rem] md:leading-[1.1]">
          Projets{" "}
          <span className="bg-gradient-to-r from-teal-600 via-primary to-slate-800 bg-clip-text text-transparent">
            des jeunes entrepreneurs
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">
          Découvrez les initiatives en cours, besoins en mentorat ou financement, et rejoignez la communauté porteuse de
          solutions.
        </p>
      </header>

      {canSubmit && (
        <section className="relative mt-12 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_12px_40px_-16px_rgba(12,74,110,0.12)] ring-1 ring-slate-200/60 md:p-8">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-teal-500 via-primary to-secondary" aria-hidden />
          <div className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-gradient-to-br from-[rgb(12_74_110_/_0.08)] to-transparent blur-2xl" />
          <div className="relative pl-4 md:pl-5">
            <h2 className="font-display text-xl font-bold text-slate-900">Soumettre un projet</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Décrivez votre idée : notre équipe pourra la relier aux dispositifs d’accompagnement adaptés.
            </p>
            <ProjectSubmitForm />
          </div>
        </section>
      )}

      <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectTile key={p.id} p={p} />
        ))}
      </div>

      {!user && (
        <aside className="relative mx-auto mt-12 max-w-xl overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-8 text-center shadow-inner ring-1 ring-slate-200/70">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-teal-600/10 text-xl" aria-hidden>
            ◈
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-700">
            Connecte-toi avec le rôle <span className="font-semibold text-primary">« entrepreneur »</span> pour
            soumettre un projet et le voir apparaître ici.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/auth/connexion?next=/projets">
              <Button>Connexion</Button>
            </Link>
            <Link href="/auth/inscription">
              <Button variant="outline">Créer un compte</Button>
            </Link>
          </div>
        </aside>
      )}

      {loggedNotEntrepreneur && (
        <aside className="relative mx-auto mt-12 max-w-xl overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white p-8 text-center ring-1 ring-amber-100/80">
          <p className="text-sm leading-relaxed text-amber-950/90">
            Ton compte n’est pas en rôle <strong>entrepreneur</strong>. Va sur ta{" "}
            <Link href="/profil" className="font-semibold text-primary underline-offset-2 hover:underline">
              page profil
            </Link>{" "}
            ou contacte l’administrateur pour faire évoluer ton rôle.
          </p>
        </aside>
      )}
    </div>
  );
}
