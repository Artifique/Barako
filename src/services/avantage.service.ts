import type { SupabaseClient } from "@supabase/supabase-js";
import { fail, ok, type ServiceResult } from "@/models/service-result";

export interface Avantage {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  display_order: number;
}

export async function listAvantages(supabase: SupabaseClient): Promise<ServiceResult<Avantage[]>> {
  const { data, error } = await supabase.from("avantages").select("*").order("display_order", { ascending: true });
  if (error) return fail(error.message);
  return ok((data ?? []) as Avantage[]);
}

export async function createAvantage(
  supabase: SupabaseClient,
  input: { title: string; description: string; icon?: string; display_order?: number }
): Promise<ServiceResult<Avantage>> {
  const { data, error } = await supabase.from("avantages").insert(input).select("*").single();
  if (error) return fail(error.message);
  return ok(data as Avantage);
}

export async function updateAvantage(
  supabase: SupabaseClient,
  id: string,
  input: { title: string; description: string; icon?: string; display_order?: number }
): Promise<ServiceResult<Avantage>> {
  const { data, error } = await supabase
    .from("avantages")
    .update({
      title: input.title,
      description: input.description,
      icon: input.icon ?? null,
      display_order: input.display_order ?? 0
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return fail(error.message);
  return ok(data as Avantage);
}

export async function deleteAvantage(supabase: SupabaseClient, id: string): Promise<ServiceResult<void>> {
  const { error } = await supabase.from("avantages").delete().eq("id", id);
  if (error) return fail(error.message);
  return ok(undefined);
}
