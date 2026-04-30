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
      .eq("formation_id", f.id)
      .in("status", ["pending", "confirmed"]);
    if (cErr) return fail(cErr.message);
    const registered = count ?? 0;
    withPlaces.push({
      ...f,
      registered_count: registered,
      places_left: Math.max(0, f.max_places - registered)
    });
  }
  return ok(withPlaces);
}

export async function registerToFormation(
  supabase: SupabaseClient,
  userId: string,
  formationId: string
): Promise<ServiceResult<{ id: string }>> {
  const places = await listFormations(supabase);
  if (!places.ok) return fail(places.error);
  const f = places.data.find((x) => x.id === formationId);
  if (!f) return fail("Formation introuvable");
  if (f.places_left <= 0) return fail("Plus de places disponibles");
  const { data, error } = await supabase
    .from("formation_registrations")
    .insert({ formation_id: formationId, user_id: userId })
    .select("id")
    .single();
  if (error) return fail(error.message);
  return ok({ id: data.id as string });
}

export async function listFormationsForAdmin(supabase: SupabaseClient): Promise<ServiceResult<Formation[]>> {
  const { data, error } = await supabase.from("formations").select("*").order("start_date", { ascending: true });
  if (error) return fail(error.message);
  return ok((data ?? []) as Formation[]);
}

export async function createFormation(
  supabase: SupabaseClient,
  input: {
    title: string;
    type: FormationType;
    description?: string | null;
    start_date: string;
    max_places: number;
  }
): Promise<ServiceResult<Formation>> {
  const { data, error } = await supabase
    .from("formations")
    .insert({
      title: input.title,
      type: input.type,
      description: input.description ?? null,
      start_date: input.start_date,
      max_places: input.max_places
    })
    .select("*")
    .single();
  if (error) return fail(error.message);
  return ok(data as Formation);
}

export async function updateFormation(
  supabase: SupabaseClient,
  id: string,
  input: {
    title: string;
    type: FormationType;
    description?: string | null;
    start_date: string;
    max_places: number;
  }
): Promise<ServiceResult<Formation>> {
  const { data, error } = await supabase
    .from("formations")
    .update({
      title: input.title,
      type: input.type,
      description: input.description ?? null,
      start_date: input.start_date,
      max_places: input.max_places
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return fail(error.message);
  return ok(data as Formation);
}

export async function deleteFormation(supabase: SupabaseClient, id: string): Promise<ServiceResult<void>> {
  const { error } = await supabase.from("formations").delete().eq("id", id);
  if (error) return fail(error.message);
  return ok(undefined);
}

export async function getFormationRegistrations(
  supabase: SupabaseClient,
  formationId: string
): Promise<ServiceResult<any[]>> {
  const { data, error } = await supabase
    .from("formation_registrations")
    .select("*, user:profiles(full_name, email)")
    .eq("formation_id", formationId);
  if (error) return fail(error.message);
  return ok(data ?? []);
}
