import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationStatus } from "@/models";
import type { JobApplicationInsertInput, JobApplicationWithOffer, TchakedaApplicationInput } from "@/models/job-application";
import { fail, ok, type ServiceResult } from "@/models/service-result";

export async function applyToJob(
  supabase: SupabaseClient,
  applicantId: string,
  input: JobApplicationInsertInput
): Promise<ServiceResult<{ id: string }>> {
  const { data, error } = await supabase
    .from("job_applications")
    .insert({
      job_offer_id: input.job_offer_id,
      applicant_id: applicantId,
      cover_letter: input.cover_letter ?? null,
      cv_url: input.cv_url ?? null
    })
    .select("id")
    .single();
  if (error) return fail(error.message);
  return ok({ id: data.id as string });
}

export async function listApplicationsByApplicant(
  supabase: SupabaseClient,
  applicantId: string
): Promise<ServiceResult<JobApplicationWithOffer[]>> {
  const { data, error } = await supabase
    .from("job_applications")
    .select(
      `
      *,
      job_offers ( id, title, companies ( name, logo_url ) )
    `
    )
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: false });
  if (error) return fail(error.message);
  return ok((data ?? []) as JobApplicationWithOffer[]);
}

export async function listApplicationsForJobOffer(
  supabase: SupabaseClient,
  jobOfferId: string
): Promise<ServiceResult<JobApplicationWithOffer[]>> {
  const { data, error } = await supabase
    .from("job_applications")
    .select(
      `
      *,
      job_offers ( id, title, companies ( name, logo_url ) ),
      applicant:profiles(full_name, email, phone)
    `
    )
    .eq("job_offer_id", jobOfferId);
  if (error) return fail(error.message);
  return ok((data ?? []) as JobApplicationWithOffer[]);
}

export async function applyToTchakedaJob(
  supabase: SupabaseClient,
  applicantId: string,
  jobOfferId: string,
  input: TchakedaApplicationInput
): Promise<ServiceResult<{ id: string }>> {
  const { data, error } = await supabase
    .from("job_applications")
    .insert({
      job_offer_id: jobOfferId,
      applicant_id: applicantId,
      has_activity_idea: input.has_activity_idea,
      has_exercised_before: input.has_exercised_before,
      cover_letter: null,
      cv_url: null,
    })
    .select("id")
    .single();
  if (error) return fail(error.message);
  return ok({ id: data.id as string });
}

export async function countApplicationsForJobOffer(
  supabase: SupabaseClient,
  jobOfferId: string
): Promise<ServiceResult<number>> {
  const { count, error } = await supabase
    .from("job_applications")
    .select("id", { count: "exact" })
    .eq("job_offer_id", jobOfferId);

  if (error) return fail(error.message);
  return ok(count ?? 0);
}

export async function hasUserAppliedToJobOffer(
  supabase: SupabaseClient,
  applicantId: string,
  jobOfferId: string
): Promise<ServiceResult<boolean>> {
  const { count, error } = await supabase
    .from("job_applications")
    .select("id", { count: "exact" })
    .eq("applicant_id", applicantId)
    .eq("job_offer_id", jobOfferId);

  if (error) return fail(error.message);
  return ok(count !== null && count > 0);
}

export async function updateApplicationStatus(
  supabase: SupabaseClient,
  applicationId: string,
  status: ApplicationStatus
): Promise<ServiceResult<void>> {
  const { error } = await supabase.from("job_applications").update({ status }).eq("id", applicationId);
  if (error) return fail(error.message);
  return ok(undefined);
}
