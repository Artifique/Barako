import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile, ProfileUpdateInput } from "@/models";
import { fail, ok, type ServiceResult } from "@/models/service-result";

export async function getProfileById(
  supabase: SupabaseClient,
  userId: string
): Promise<ServiceResult<Profile | null>> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) return fail(error.message);
  return ok(data as Profile | null);
}

export async function getCurrentProfile(supabase: SupabaseClient): Promise<ServiceResult<Profile | null>> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return fail(userError?.message ?? "Non authentifié");
  return getProfileById(supabase, userData.user.id);
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  input: ProfileUpdateInput
): Promise<ServiceResult<Profile>> {
  const { data, error } = await supabase.from("profiles").update(input).eq("id", userId).select("*").single();
  if (error) return fail(error.message);
  return ok(data as Profile);
}

export async function listProfilesForAdmin(
  supabase: SupabaseClient,
  params?: { search?: string; role?: string; limit?: number }
): Promise<ServiceResult<Profile[]>> {
  let q = supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(params?.limit ?? 100);
  if (params?.role) q = q.eq("role", params.role);
  if (params?.search) {
    const pat = `%${params.search}%`;
    q = q.or(`full_name.ilike.${pat},email.ilike.${pat}`);
  }
  const { data, error } = await q;
  if (error) return fail(error.message);
  return ok((data ?? []) as Profile[]);
}

export async function setProfileActive(
  supabase: SupabaseClient,
  userId: string,
  is_active: boolean
): Promise<ServiceResult<Profile>> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_active })
    .eq("id", userId)
    .select("*")
    .single();
  if (error) return fail(error.message);
  return ok(data as Profile);
}
