"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/models";
import type { JobApplicationInsertInput } from "@/models/job-application";
import * as JobApplicationService from "@/services/job-application.service";
import * as ActivityLogService from "@/services/activity-log.service";

export async function applyToJobAction(input: JobApplicationInsertInput) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Connecte-toi pour postuler." };
  const res = await JobApplicationService.applyToJob(supabase, userData.user.id, input);
  if (res.ok) {
    await ActivityLogService.logActivity(supabase, {
      actor_id: userData.user.id,
      action_type: "job_apply",
      entity_type: "job_offer",
      entity_id: input.job_offer_id,
      metadata: null
    });
    revalidatePath("/profil");
    revalidatePath(`/offres/${input.job_offer_id}`);
  }
  return res;
}

export async function listMyApplicationsAction() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Non authentifié" };
  return JobApplicationService.listApplicationsByApplicant(supabase, userData.user.id);
}

export async function listApplicationsForOfferAction(jobOfferId: string) {
  const supabase = await createClient();
  return JobApplicationService.listApplicationsForJobOffer(supabase, jobOfferId);
}

export async function updateApplicationStatusAction(applicationId: string, status: ApplicationStatus) {
  const supabase = await createClient();
  const res = await JobApplicationService.updateApplicationStatus(supabase, applicationId, status);
  if (res.ok) revalidatePath("/admin/offres");
  return res;
}
