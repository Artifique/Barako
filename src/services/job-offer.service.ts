import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobOfferFilters, JobOfferInsertInput, JobOfferWithCompany } from "@/models";
import { fail, ok, type ServiceResult } from "@/models/service-result";

const offerSelect = `
  *,
  companies ( id, name, logo_url, location )
`;

export async function listPublishedJobOffers(
  supabase: SupabaseClient,
  filters?: JobOfferFilters
): Promise<ServiceResult<JobOfferWithCompany[]>> {
  let q = supabase
    .from("job_offers")
    .select(offerSelect)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (filters?.sector) q = q.ilike("sector", `%${filters.sector}%`);
  if (filters?.location) q = q.ilike("location", `%${filters.location}%`);
  if (filters?.contract_type) q = q.eq("contract_type", filters.contract_type);
  if (filters?.search) {
    q = q.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await q;
  if (error) return fail(error.message);
  return ok((data ?? []) as JobOfferWithCompany[]);
}

export async function getJobOfferById(
  supabase: SupabaseClient,
  id: string
): Promise<ServiceResult<JobOfferWithCompany | null>> {
  const { data, error } = await supabase.from("job_offers").select(offerSelect).eq("id", id).maybeSingle();
  if (error) return fail(error.message);
  return ok(data as JobOfferWithCompany | null);
}

export async function createJobOffer(
  supabase: SupabaseClient,
  input: JobOfferInsertInput
): Promise<ServiceResult<JobOfferWithCompany>> {
  const { data, error } = await supabase.from("job_offers").insert({ ...input, type_bourse: input.type_bourse ?? "regular" }).select(offerSelect).single();
  if (error) return fail(error.message);
  return ok(data as JobOfferWithCompany);
}

export async function updateJobOffer(
  supabase: SupabaseClient,
  id: string,
  patch: Partial<JobOfferInsertInput> & { status?: string }
): Promise<ServiceResult<JobOfferWithCompany>> {
  const { data, error } = await supabase.from("job_offers").update(patch).eq("id", id).select(offerSelect).single();
  if (error) return fail(error.message);
  return ok(data as JobOfferWithCompany);
}

export async function listJobOffersForAdmin(supabase: SupabaseClient): Promise<ServiceResult<JobOfferWithCompany[]>> {
  const { data, error } = await supabase
    .from("job_offers")
    .select(offerSelect)
    .order("created_at", { ascending: false });
  if (error) return fail(error.message);
  return ok((data ?? []) as JobOfferWithCompany[]);
}

export async function deleteJobOffer(supabase: SupabaseClient, id: string): Promise<ServiceResult<void>> {
  const { error } = await supabase.from("job_offers").delete().eq("id", id);
  if (error) return fail(error.message);
  return ok(undefined);
}
