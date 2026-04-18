import type { SupabaseClient } from "@supabase/supabase-js";
import type { Company, CompanyInsertInput } from "@/models";
import { fail, ok, type ServiceResult } from "@/models/service-result";

export async function createCompany(
  supabase: SupabaseClient,
  ownerId: string,
  input: CompanyInsertInput
): Promise<ServiceResult<Company>> {
  const { data, error } = await supabase
    .from("companies")
    .insert({ ...input, owner_id: ownerId })
    .select("*")
    .single();
  if (error) return fail(error.message);
  return ok(data as Company);
}

export async function getCompanyByOwner(
  supabase: SupabaseClient,
  ownerId: string
): Promise<ServiceResult<Company | null>> {
  const { data, error } = await supabase.from("companies").select("*").eq("owner_id", ownerId).maybeSingle();
  if (error) return fail(error.message);
  return ok(data as Company | null);
}

export async function getCompanyById(
  supabase: SupabaseClient,
  id: string
): Promise<ServiceResult<Company | null>> {
  const { data, error } = await supabase.from("companies").select("*").eq("id", id).maybeSingle();
  if (error) return fail(error.message);
  return ok(data as Company | null);
}

export async function updateCompany(
  supabase: SupabaseClient,
  companyId: string,
  input: Partial<CompanyInsertInput>
): Promise<ServiceResult<Company>> {
  const { data, error } = await supabase.from("companies").update(input).eq("id", companyId).select("*").single();
  if (error) return fail(error.message);
  return ok(data as Company);
}

export async function listCompaniesForAdmin(supabase: SupabaseClient): Promise<ServiceResult<Company[]>> {
  const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
  if (error) return fail(error.message);
  return ok((data ?? []) as Company[]);
}
