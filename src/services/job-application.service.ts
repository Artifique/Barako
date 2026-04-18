import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationStatus } from "@/models";
import type { JobApplicationInsertInput, JobApplicationWithOffer } from "@/models/job-application";
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
      job_offers ( id, title, companies ( name, logo_url ) )
    `
    )
    .eq("job_offer_id", jobOfferId);
  if (error) return fail(error.message);
  return ok((data ?? []) as JobApplicationWithOffer[]);
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
