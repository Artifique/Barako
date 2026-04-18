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
