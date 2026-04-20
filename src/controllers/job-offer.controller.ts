"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { JobOfferFilters, JobOfferInsertInput } from "@/models";
import * as JobOfferService from "@/services/job-offer.service";

export async function listPublishedOffersAction(filters?: JobOfferFilters) {
  const supabase = await createClient();
  return JobOfferService.listPublishedJobOffers(supabase, filters);
}

export async function getOfferByIdAction(id: string) {
  const supabase = await createClient();
  return JobOfferService.getJobOfferById(supabase, id);
}

export async function createJobOfferAction(input: JobOfferInsertInput) {
  const supabase = await createClient();
  const res = await JobOfferService.createJobOffer(supabase, input);
  if (res.ok) {
    revalidatePath("/offres");
    revalidatePath("/admin/offres");
  }
  return res;
}

export async function updateJobOfferAction(id: string, patch: Partial<JobOfferInsertInput> & { status?: string }) {
  const supabase = await createClient();
  const res = await JobOfferService.updateJobOffer(supabase, id, patch);
  if (res.ok) {
    revalidatePath("/offres");
    revalidatePath(`/offres/${id}`);
    revalidatePath("/admin/offres");
  }
  return res;
}

export async function listOffersAdminAction() {
  const supabase = await createClient();
  return JobOfferService.listJobOffersForAdmin(supabase);
}

export async function deleteJobOfferAction(id: string) {
  const supabase = await createClient();
  const res = await JobOfferService.deleteJobOffer(supabase, id);
  if (res.ok) {
    revalidatePath("/offres");
    revalidatePath("/admin/offres");
  }
  return res;
}
