import type { SupabaseClient } from "@supabase/supabase-js";
import type { Partner } from "@/models";
import { fail, ok, type ServiceResult } from "@/models/service-result";

export async function listPartners(supabase: SupabaseClient): Promise<ServiceResult<Partner[]>> {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) return fail(error.message);
  return ok((data ?? []) as Partner[]);
}

export async function createPartner(
  supabase: SupabaseClient,
  input: { name: string; description?: string | null; website?: string | null; display_order?: number }
): Promise<ServiceResult<Partner>> {
  const { data, error } = await supabase
    .from("partners")
    .insert({
      name: input.name,
      description: input.description ?? null,
      website: input.website ?? null,
      display_order: input.display_order ?? 0
    })
    .select("*")
    .single();
  if (error) return fail(error.message);
  return ok(data as Partner);
}

export async function updatePartner(
  supabase: SupabaseClient,
  id: string,
  input: { name: string; description?: string | null; website?: string | null; display_order?: number }
): Promise<ServiceResult<Partner>> {
  const { data, error } = await supabase
    .from("partners")
    .update({
      name: input.name,
      description: input.description ?? null,
      website: input.website ?? null,
      display_order: input.display_order ?? 0
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return fail(error.message);
  return ok(data as Partner);
}

export async function deletePartner(supabase: SupabaseClient, id: string): Promise<ServiceResult<void>> {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) return fail(error.message);
  return ok(undefined);
}
