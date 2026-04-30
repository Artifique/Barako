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
  id: string,
  input: { 
    name: string; 
    sector?: string | null; 
    email?: string | null; 
    responsible_name?: string | null; 
    responsible_function?: string | null; 
    responsible_phone?: string | null; 
    company_type?: string | null; 
  }
): Promise<ServiceResult<any>> {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      company_name: input.name,
      company_sector: input.sector,
      email: input.email,
      responsible_name: input.responsible_name,
      responsible_function: input.responsible_function,
      responsible_phone: input.responsible_phone,
      company_type: input.company_type
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function listCompaniesForAdmin(supabase: SupabaseClient): Promise<ServiceResult<Company[]>> {
  const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
  if (error) return fail(error.message);
  return ok((data ?? []) as Company[]);
}
