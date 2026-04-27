"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPublicStats() {
  const supabase = await createClient();
  
  // Compter les offres publiées
  const { count: offersCount } = await supabase
    .from("job_offers")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  // Compter les projets (actifs)
  const { count: projectsCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true });

  // Compter les entreprises partenaires
  const { count: companiesCount } = await supabase
    .from("companies")
    .select("id", { count: "exact", head: true });

  return {
    offersCount: offersCount ?? 0,
    projectsCount: projectsCount ?? 0,
    companiesCount: companiesCount ?? 0,
  };
}
