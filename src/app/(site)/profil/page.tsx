import { redirect } from "next/navigation";
import { createClientOptional } from "@/lib/supabase/server";
import * as ProfileService from "@/services/profile.service";
import * as JobApplicationService from "@/services/job-application.service";
import * as CompanyService from "@/services/company.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileEditForm } from "@/components/forms/profile-edit-form";
import { CompanyCreateForm } from "@/components/forms/company-create-form";
import { JobOfferCreateForm } from "@/components/forms/job-offer-create-form";

export default async function ProfilPage() {
  const supabase = await createClientOptional();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Card>
          <p className="text-sm text-slate-600">Supabase non configuré.</p>
        </Card>
      </div>
    );
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/connexion?next=/profil");

  const profileRes = await ProfileService.getCurrentProfile(supabase);
  const profile = profileRes.ok ? profileRes.data : null;
  const appsRes = await JobApplicationService.listApplicationsByApplicant(supabase, user.id);
  const apps = appsRes.ok ? appsRes.data : [];
  const companyRes = await CompanyService.getCompanyByOwner(supabase, user.id);
  const company = companyRes.ok ? companyRes.data : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Mon profil</h1>
        <p className="text-sm text-slate-600">{profile?.email}</p>
        {profile?.role && (
          <Badge variant="info" className="mt-2">
            {profile.role}
          </Badge>
        )}
      </div>

      <Card glowing>
        <h2 className="font-display text-lg font-semibold text-slate-900">Informations</h2>
        {profile && <ProfileEditForm initial={{ full_name: profile.full_name ?? "", phone: profile.phone ?? "", bio: profile.bio ?? "" }} />}
      </Card>

      {profile?.role === "company" && (
        <Card glowing>
          <h2 className="font-display text-lg font-semibold text-slate-900">Entreprise</h2>
          {company ? (
            <div className="mt-2 space-y-6">
              <p className="text-sm text-slate-600">
                {company.name} — {company.location}
              </p>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Nouvelle offre</h3>
                <JobOfferCreateForm companyId={company.id} />
              </div>
            </div>
          ) : (
            <CompanyCreateForm />
          )}
        </Card>
      )}

      <Card glowing>
        <h2 className="font-display text-lg font-semibold text-slate-900">Mes candidatures</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {apps.map((a) => (
            <li key={a.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="font-medium text-slate-900">{a.job_offers?.title}</p>
              <p className="text-xs text-slate-500">{a.job_offers?.companies?.name}</p>
              <Badge variant="gold" className="mt-2">
                {a.status}
              </Badge>
            </li>
          ))}
          {apps.length === 0 && <p className="text-slate-600">Aucune candidature pour l’instant.</p>}
        </ul>
      </Card>
    </div>
  );
}
