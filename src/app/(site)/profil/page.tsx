import { redirect } from "next/navigation";
import { createClientOptional } from "@/lib/supabase/server";
import * as ProfileService from "@/services/profile.service";
import * as JobApplicationService from "@/services/job-application.service";
import * as CompanyService from "@/services/company.service";
import * as AvantageService from "@/services/avantage.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileEditForm } from "@/components/forms/profile-edit-form";
import { CompanyCreateForm } from "@/components/forms/company-create-form";
import { JobOfferCreateForm } from "@/components/forms/job-offer-create-form";
import { Button } from "@/components/ui/button";
import { signOut } from "@/controllers/auth.controller";
import Link from "next/link";

export default async function ProfilPage() {
  const supabase = await createClientOptional();
  const { data: { user } } = await (supabase?.auth.getUser() ?? { data: { user: null } });
  
  if (!user) redirect("/auth/connexion?next=/profil");

  const [profileRes, appsRes, companyRes, avantagesRes] = await Promise.all([
    ProfileService.getCurrentProfile(supabase!),
    JobApplicationService.listApplicationsByApplicant(supabase!, user.id),
    CompanyService.getCompanyByOwner(supabase!, user.id),
    AvantageService.listAvantages(supabase!)
  ]);

  const profile = profileRes.ok ? profileRes.data : null;
  const apps = appsRes.ok ? appsRes.data : [];
  const company = companyRes.ok ? companyRes.data : null;
  const avantages = avantagesRes.ok ? avantagesRes.data : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Mon Profil</h1>
          <p className="text-slate-500">{profile?.email}</p>
        </div>
        <form action={signOut}>
          <Button variant="ghost" className="rounded-full shadow-md bg-red-500 text-white hover:bg-red-600">Déconnexion</Button>
        </form>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Colonne Gauche : Infos */}
        <div className="md:col-span-2 space-y-8">
          <Card className="p-6 rounded-3xl shadow-sm border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Informations personnelles</h2>
            {profile && <ProfileEditForm initial={{ full_name: profile.full_name ?? "", phone: profile.phone ?? "", bio: profile.bio ?? "" }} />}
          </Card>

          {profile?.role === "job_seeker" && (
            <Card className="p-6 rounded-3xl shadow-sm border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Mes candidatures</h2>
              <div className="space-y-4">
                {apps.map((a) => (
                  <div key={a.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-semibold text-slate-900">{a.job_offers?.title}</p>
                      <p className="text-sm text-slate-500">{a.job_offers?.companies?.name ?? "Baarako"}</p>
                    </div>
                    <Badge variant="gold">{a.status}</Badge>
                  </div>
                ))}
                {apps.length === 0 && <p className="text-slate-500 italic">Aucune candidature pour l'instant.</p>}
              </div>
            </Card>
          )}
        </div>

        {/* Colonne Droite : Entreprise / Avantages */}
        <div className="space-y-8">
          {profile?.role === "company" && (
            <Card className="p-6 rounded-3xl shadow-sm border-slate-100 bg-slate-900 text-white">
              <h2 className="text-xl font-bold mb-6">Pour vous</h2>
              <div className="space-y-4">
                {avantages.map((a) => (
                  <div key={a.id} className="flex gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <div>
                        <p className="font-semibold">{a.title}</p>
                        <p className="text-xs text-slate-300">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/besoins" className="block mt-8">
                  <Button className="w-full rounded-full bg-primary hover:bg-orange-600">Exprimer mes besoins</Button>
              </Link>
            </Card>
          )}

          {profile?.role === "company" && (
             <Card className="p-6 rounded-3xl shadow-sm border-slate-100">
                <h2 className="text-lg font-bold mb-4">Gestion entreprise</h2>
                {company ? (
                   <JobOfferCreateForm companyId={company.id} />
                ) : (
                   <CompanyCreateForm />
                )}
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
