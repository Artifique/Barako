import Link from "next/link";
import Image from "next/image"; // Import Image component
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

  // Logo colors
  const primaryOrange = "#F57C00"; // Main orange
  const darkBlue = "#0D47A1";     // Dark blue
  const lightOrange = "#FFA726";  // Light orange
  const darkGreen = "#2E8B57";    // Dark green
  const yellowGold = "#FFD54F";   // Yellow/Gold

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-6">
      {/* Hero Image: Using job.png as a general hero image for the projects page, or could be removed if not relevant */}
      {/* Decided to use a color gradient instead of job.png for Projets page, as job.png is for Offres */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${lightOrange}33, transparent 55%)`,
        }}
      />

      <header className="relative mx-auto max-w-3xl text-center">
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-900 md:text-[2.65rem] md:leading-[1.1]">
          Projets{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              background: `linear-gradient(to right, ${primaryOrange}, ${darkGreen})`,
            }}
          >
            des jeunes entrepreneurs
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">
          Découvrez les initiatives en cours, besoins en mentorat ou financement, et rejoignez la communauté porteuse de
          solutions.
        </p>
      </header>

      {/* Section de soumission retirée */}

      <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectTile key={p.id} p={p} />
        ))}
      </div>

      {!user && (
        <aside className="relative mx-auto mt-12 max-w-xl overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-8 text-center shadow-inner ring-1 ring-slate-200/70" style={{ borderColor: primaryOrange }}>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-teal-600/10 text-xl" aria-hidden style={{ background: `linear-gradient(to bottom right, ${primaryOrange}1a, ${darkGreen}10)` }}>
            ◈
          </div>
          <p className="text-sm font-medium leading-relaxed text-slate-700">
            Connectez-vous pour découvrir l'ensemble des projets portés par les jeunes entrepreneurs de la communauté Baarako.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/auth/connexion?next=/projets">
              <Button style={{ backgroundColor: primaryOrange, color: 'white' }}>Connexion</Button>
            </Link>
            <Link href="/auth/inscription">
              <Button variant="outline" style={{ borderColor: primaryOrange, color: primaryOrange }}>Créer un compte</Button>
            </Link>
          </div>
        </aside>
      )}

      {loggedNotEntrepreneur && (
        <aside className="relative mx-auto mt-12 max-w-xl overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white p-8 text-center ring-1 ring-amber-100/80" style={{ borderColor: lightOrange }}>
          <p className="text-sm leading-relaxed text-amber-950/90">
            Ton compte n’est pas en rôle <strong>entrepreneur</strong>. Va sur ta{" "}
            <Link href="/profil" className="font-semibold underline-offset-2 hover:underline" style={{ color: primaryOrange }}>
              page profil
            </Link>{" "}
            ou contacte l’administrateur pour faire évoluer ton rôle.
          </p>
        </aside>
      )}
    </div>
  );
}
