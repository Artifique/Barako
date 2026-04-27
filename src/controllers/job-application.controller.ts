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
    revalidatePath(`/bourses/${input.job_offer_id}`);
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

import type { TchakedaApplicationInput } from "@/models/job-application";

export async function applyToTchakedaBourseAction(jobOfferId: string, input: TchakedaApplicationInput) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Connecte-toi pour postuler." };

  const hasAppliedRes = await JobApplicationService.hasUserAppliedToJobOffer(supabase, userData.user.id, jobOfferId);
  if (hasAppliedRes.ok && hasAppliedRes.data) {
    return { ok: false as const, error: "Tu as déjà postulé à cette bourse." };
  }

  const res = await JobApplicationService.applyToTchakedaJob(supabase, userData.user.id, jobOfferId, input);
  if (res.ok) {
    await ActivityLogService.logActivity(supabase, {
      actor_id: userData.user.id,
      action_type: "tchakeda_bourse_apply",
      entity_type: "job_offer",
      entity_id: jobOfferId,
      metadata: null
    });
    revalidatePath("/profil");
    revalidatePath(`/bourses/${jobOfferId}`);
  }
  return res;
}

export async function countApplicationsForJobOfferAction(jobOfferId: string) {
  const supabase = await createClient();
  return JobApplicationService.countApplicationsForJobOffer(supabase, jobOfferId);
}

export async function hasUserAppliedToJobOfferAction(jobOfferId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Non authentifié" };
  return JobApplicationService.hasUserAppliedToJobOffer(supabase, userData.user.id, jobOfferId);
}

export async function updateApplicationStatusAction(applicationId: string, status: ApplicationStatus) {
  const supabase = await createClient();
  const res = await JobApplicationService.updateApplicationStatus(supabase, applicationId, status);
  if (res.ok) revalidatePath("/admin/bourses");
  return res;
}
