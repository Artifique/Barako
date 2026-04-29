import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroCarousel } from "@/components/layout/hero-carousel";
import { getPublicStats } from "@/controllers/stats.controller";

export default async function HomePage() {
  const statsData = await getPublicStats();
  
  const stats = [
    { label: "Bourses d’emploi", value: `${statsData.offersCount}`, hint: "Bourse Baarako" },
    { label: "Projets accompagnés", value: `${statsData.projectsCount}`, hint: "Initiatives soutenues" },
    { label: "Entreprises partenaires", value: `${statsData.companiesCount}`, hint: "Réseau" },
    { label: "Taux d’insertion", value: "85%", hint: "Objectif" }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8">
      <section className="mb-12">
        <Badge variant="gold" className="mb-4">
          Insertion & entrepreneuriat
        </Badge>
        <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          La bourse emploi & projets pour les{" "}
          <span className="bg-gradient-to-r from-primary via-teal-600 to-secondary bg-clip-text text-transparent">
            jeunes au Mali
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Un espace unique pour postuler aux offres, structurer votre projet et suivre des formations alignées sur le
          marché.
        </p>
      </section>

      <HeroCarousel />

      <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} glowing className="h-full border-t-4 border-t-primary/80">
            <p className="font-display text-3xl font-bold text-primary">{s.value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{s.label}</p>
            <p className="text-xs text-slate-500">{s.hint}</p>
          </Card>
        ))}
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <Card glowing>
          <h2 className="font-display text-xl font-bold text-slate-900">Comment ça marche</h2>
          <ol className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="font-mono text-primary">1.</span>
              <span>Inscription et choix du rôle (candidat, entrepreneur ou entreprise).</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-primary">2.</span>
              <span>Profil ou fiche entreprise complétée pour gagner en visibilité.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-teal-600">3.</span>
              <span>Candidature aux offres ou soumission de projet selon votre parcours.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-secondary">4.</span>
              <span>Accompagnement vers l’insertion ou le financement.</span>
            </li>
          </ol>
        </Card>
        <Card glowing>
          <h2 className="font-display text-xl font-bold text-slate-900">Rejoignez-nous</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Commencez votre parcours professionnel aujourd'hui en créant votre espace personnalisé.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/auth/inscription">
              <Button>Créer un compte</Button>
            </Link>
            <Link href="/formations">
              <Button variant="outline">Formations</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
