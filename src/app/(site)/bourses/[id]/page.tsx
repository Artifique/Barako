import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOfferByIdAction } from "@/controllers/job-offer.controller";
import { createClientOptional } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplyJobForm } from "@/components/forms/apply-job-form";
import { ApplyTchakedaBourseModal } from "@/components/modals/apply-tchakeda-bourse-modal"; // Import du modal Tchakèda
import { hasUserAppliedToJobOfferAction } from "@/controllers/job-application.controller"; // Import de l'action de vérification de candidature
import { Button } from "@/components/ui/button"; // Import du bouton
import { revalidatePath } from "next/cache"; // Import de revalidatePath

type Props = { params: { id: string } };

export default async function OffreDetailPage({ params }: Props) {
  const { id } = params;
  const supabase = await createClientOptional();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Card>
          <p className="text-sm text-text-muted">Supabase non configuré.</p>
        </Card>
      </div>
    );
  }
  const res = await getOfferByIdAction(id);
  if (!res.ok || !res.data) notFound();
  const o = res.data;
  if (o.status !== "published") notFound();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  let role: string | null = null;
  let hasApplied = false;

  if (user) {
    const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = profileData?.role ?? null;

    const hasAppliedRes = await hasUserAppliedToJobOfferAction(id);
    if (hasAppliedRes.ok) {
      hasApplied = hasAppliedRes.data;
    }
  }

  const isJobSeeker = role === "job_seeker";
  const isTchakedaBourse = o.type_bourse === "tchakeda";


  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
      <div>
        <Link href="/bourses" className="text-sm font-medium text-primary hover:underline">
          ← Retour aux bourses
        </Link>
        {o.image_url && (
          <div className="relative mt-6 h-64 w-full">
            <Image
              src={o.image_url}
              alt={o.title}
              fill
              className="rounded-2xl object-cover shadow-lg"
            />
          </div>
        )}
        <h1 className="mt-4 font-display text-3xl font-bold text-slate-900">{o.title}</h1>
        <p className="mt-1 text-slate-600">
          {o.companies?.name} — {o.location}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="info">{o.contract_type}</Badge>
          {o.sector && <Badge variant="gold">{o.sector}</Badge>}
        </div>
        <Card className="mt-8 space-y-6">
          {o.description && (
            <section>
              <h2 className="font-semibold text-slate-900">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{o.description}</p>
            </section>
          )}
          {o.missions && (
            <section>
              <h2 className="font-semibold text-slate-900">Missions</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{o.missions}</p>
            </section>
          )}
          {o.requirements && (
            <section>
              <h2 className="font-semibold text-slate-900">Profil recherché</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{o.requirements}</p>
            </section>
          )}
          {o.benefits && (
            <section>
              <h2 className="font-semibold text-slate-900">Avantages</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{o.benefits}</p>
            </section>
          )}
        </Card>
      </div>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <Card glowing>
          <p className="text-sm font-medium text-slate-500">Rémunération</p>
          <p className="mt-1 font-display text-xl font-bold text-primary">
            {o.salary_min != null && o.salary_max != null
              ? `${o.salary_min.toLocaleString()} – ${o.salary_max.toLocaleString()} ${o.currency}`
              : "—"}
          </p>
          {o.expires_at && (
            <p className="mt-2 text-xs text-slate-500">Expire le {new Date(o.expires_at).toLocaleDateString("fr-FR")}</p>
          )}

          {isJobSeeker && !hasApplied ? (
            isTchakedaBourse ? (
              <ApplyTchakedaBourseModal jobOfferId={o.id} onApplied={() => revalidatePath("/bourses/" + o.id)} />
            ) : (
              <ApplyJobForm jobOfferId={o.id} isAuthenticated={!!user} canApply={true} />
            )
          ) : isJobSeeker && hasApplied ? (
            <Button disabled className="w-full mt-4">Déjà postulé</Button>
          ) : (
            <p className="text-sm text-slate-600 mt-4">Connecte-toi en tant que candidat pour postuler.</p>
          )}
        </Card>
      </aside>
    </div>
  );
}
