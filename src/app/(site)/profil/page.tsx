import { redirect } from "next/navigation";
import Image from "next/image"; // Import Image component
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

  // Logo colors
  const primaryOrange = "#F57C00"; // Main orange
  const darkBlue = "#0D47A1";     // Dark blue
  const lightOrange = "#FFA726";  // Light orange
  const darkGreen = "#2E8B57";    // Dark green
  const yellowGold = "#FFD54F";   // Yellow/Gold

  return (
    <div className="relative mx-auto max-w-4xl space-y-8 px-4 py-10 overflow-hidden" style={{ backgroundColor: '#f0f4f8' /* Subtle light blue-Egray background */ }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(circle, ${primaryOrange}80, transparent 70%)` }}/>
      <div className="absolute bottom-1/3 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full blur-2xl opacity-20" style={{ background: `radial-gradient(circle, ${darkGreen}, transparent 70%)` }}/>

      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: darkBlue }}>
          Mon profil
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{profile?.email}</p>
        {profile?.role && (
          <Badge variant="info" className="mt-2" style={{ backgroundColor: darkGreen, color: 'white' }}>
            {profile.role}
          </Badge>
        )}
      </div>

      {/* Card for User Information */}
      <Card glowing className="relative z-10" style={{ borderColor: primaryOrange, backgroundColor: '#e0f2fe' /* Light blue tint for card background */ }}>
        <h2 className="font-display text-lg font-semibold" style={{ color: darkBlue }}>Informations personnelles</h2>
        {profile && <ProfileEditForm initial={{ full_name: profile.full_name ?? "", phone: profile.phone ?? "", bio: profile.bio ?? "" }} />}
      </Card>

      {/* Card for Company Information (if user role is company) */}
      {profile?.role === "company" && (
        <Card glowing className="relative z-10" style={{ borderColor: primaryOrange, backgroundColor: '#e0f2fe' }}>
          <h2 className="font-display text-lg font-semibold" style={{ color: darkBlue }}>Entreprise</h2>
          {company ? (
            <div className="mt-2 space-y-6">
              <p className="text-sm text-slate-600">
                {company.name} — {company.location}
              </p>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: darkBlue }}>Nouvelle offre</h3>
                <JobOfferCreateForm companyId={company.id} />
              </div>
            </div>
          ) : (
            <CompanyCreateForm />
          )}
        </Card>
      )}

      {/* Card for Job Applications */}
      <Card glowing className="relative z-10" style={{ borderColor: primaryOrange, backgroundColor: '#e0f2fe' }}>
        <h2 className="font-display text-lg font-semibold" style={{ color: darkBlue }}>Mes candidatures</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {apps.map((a) => (
            <li key={a.id} className="rounded-xl border p-4" style={{ borderColor: lightOrange, backgroundColor: '#ffffff' /* White background for list items */ }}>
              <p className="font-medium text-slate-900">{a.job_offers?.title}</p>
              <p className="text-xs text-slate-500">{a.job_offers?.companies?.name}</p>
              <Badge variant="gold" style={{ backgroundColor: yellowGold, color: darkBlue }} className="mt-2">
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
