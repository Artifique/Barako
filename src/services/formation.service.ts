import type { SupabaseClient } from "@supabase/supabase-js";
import type { Formation, FormationType, FormationWithPlaces } from "@/models";
import { fail, ok, type ServiceResult } from "@/models/service-result";

export async function listFormations(supabase: SupabaseClient): Promise<ServiceResult<FormationWithPlaces[]>> {
  const { data: formations, error } = await supabase
    .from("formations")
    .select("*")
    .order("start_date", { ascending: true });
  
  if (error) return fail(error.message);
  
  const list = (formations ?? []) as Formation[];
  const withPlaces: FormationWithPlaces[] = [];
  
  for (const f of list) {
    const { count, error: cErr } = await supabase
      .from("formation_registrations")
      .select("id", { count: "exact", head: true })
      .eq("formation_id", f.id);
    
    const registered = cErr ? 0 : (count ?? 0);
    
    withPlaces.push({
      ...f,
      registered_count: registered,
      places_left: Math.max(0, f.max_places - registered)
    });
  }
  return ok(withPlaces);
}

// ... (registerToFormation identique)

export async function listFormationsForAdmin(supabase: SupabaseClient): Promise<ServiceResult<FormationWithPlaces[]>> {
  const { data: formations, error } = await supabase
    .from("formations")
    .select("*")
    .order("start_date", { ascending: true });
  
  if (error) return fail(error.message);

  const withPlaces = await Promise.all(
    (formations || []).map(async (f) => {
      const { count } = await supabase
        .from("formation_registrations")
        .select("id", { count: "exact", head: true })
        .eq("formation_id", f.id);
      
      const registered = count ?? 0;
      return {
        ...f,
        registered_count: registered,
        places_left: Math.max(0, f.max_places - registered)
      };
    })
  );

  return ok(withPlaces as FormationWithPlaces[]);
}

// ... (create/update/delete identiques)

export async function getFormationRegistrations(
  supabase: SupabaseClient,
  formationId: string
): Promise<ServiceResult<any[]>> {
  console.log("DEBUG SERVICE: Tentative de récupération pour formation_id:", formationId);
  
  const { data: registrations, error: regError } = await supabase
    .from("formation_registrations")
    .select("*")
    .eq("formation_id", formationId);
  
  console.log("DEBUG SERVICE: Inscriptions brutes trouvées:", registrations);
  
  if (regError) {
    console.error("Erreur récup. inscriptions:", regError);
    return fail(regError.message);
  }
  
  if (!registrations || registrations.length === 0) {
      console.log("DEBUG SERVICE: Aucune inscription trouvée pour cet ID.");
      return ok([]);
  }

  const userIds = Array.from(new Set(registrations.map((r) => r.user_id)));
  console.log("DEBUG SERVICE: UserIDs trouvés:", userIds);
  
  const { data: profiles, error: profError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  if (profError) {
    console.error("Erreur récup. profils:", profError);
  }

  console.log("DEBUG SERVICE: Profils trouvés:", profiles);

  const enriched = registrations.map((r: any) => ({
    ...r,
    user: profiles?.find((p) => p.id === r.user_id) || { full_name: "Inconnu", email: "—" }
  }));

  return ok(enriched);
}
