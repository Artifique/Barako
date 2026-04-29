import { redirect } from "next/navigation";
import { createClientOptional } from "@/lib/supabase/server";
import * as ProfileService from "@/services/profile.service";
import * as AvantageService from "@/services/avantage.service";
import ProfilPage from "./profil-client";

export default async function Page() {
  const supabase = await createClientOptional();
  const { data: { user } } = await (supabase?.auth.getUser() ?? { data: { user: null } });
  
  if (!user) redirect("/auth/connexion?next=/profil");

  const [profileRes, avantagesRes] = await Promise.all([
    ProfileService.getCurrentProfile(supabase!),
    AvantageService.listAvantages(supabase!)
  ]);

  const profile = profileRes.ok ? profileRes.data : null;
  const avantages = avantagesRes.ok ? avantagesRes.data : [];

  return <ProfilPage profile={profile} avantages={avantages} />;
}
