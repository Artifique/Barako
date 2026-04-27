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

export async function createJobOfferAction(fd: FormData) {
  const supabase = await createClient();
  const imageFile = fd.get("image") as File;
  let image_url = null;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${crypto.randomUUID()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from('bourse-images').upload(fileName, imageFile);
    if (!uploadError) {
      const { data } = supabase.storage.from('bourse-images').getPublicUrl(fileName);
      image_url = data.publicUrl;
    }
  }

  const payload: any = {
      title: String(fd.get("title")),
      description: String(fd.get("description") || "") || null,
      missions: String(fd.get("missions") || "") || null,
      type_bourse: String(fd.get("type_bourse") ?? "regular"),
      status: String(fd.get("status") ?? "draft"),
      image_url
  };

  const res = await JobOfferService.createJobOffer(supabase, payload);
  if (res.ok) {
    revalidatePath("/bourses");
    revalidatePath("/admin/bourses");
  }
  return res;
}

export async function updateJobOfferAction(id: string, fd: FormData) {
  const supabase = await createClient();
  const imageFile = fd.get("image") as File;
  let image_url = undefined;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${crypto.randomUUID()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from('bourse-images').upload(fileName, imageFile);
    if (!uploadError) {
      const { data } = supabase.storage.from('bourse-images').getPublicUrl(fileName);
      image_url = data.publicUrl;
    }
  }

  const payload: any = {
      title: String(fd.get("title")),
      description: String(fd.get("description") || "") || null,
      missions: String(fd.get("missions") || "") || null,
      type_bourse: String(fd.get("type_bourse") ?? "regular"),
      status: String(fd.get("status") ?? "draft"),
  };
  if (image_url !== undefined) payload.image_url = image_url;

  const res = await JobOfferService.updateJobOffer(supabase, id, payload);
  if (res.ok) {
    revalidatePath("/bourses");
    revalidatePath("/admin/bourses");
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
    revalidatePath("/bourses");
    revalidatePath("/admin/bourses");
  }
  return res;
}
