"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import * as PartnerService from "@/services/partner.service";

export async function createPartnerAdminAction(input: {
  name: string;
  description?: string | null;
  website?: string | null;
  display_order?: number;
}) {
  const supabase = await createClient();
  const res = await PartnerService.createPartner(supabase, input);
  if (res.ok) revalidatePath("/admin/partenaires");
  return res;
}

export async function updatePartnerAdminAction(id: string, input: any) {
  const supabase = await createClient();
  const res = await PartnerService.updatePartner(supabase, id, input);
  if (res.ok) revalidatePath("/admin/partenaires");
  return res;
}

export async function deletePartnerAdminAction(id: string) {
  const supabase = await createClient();
  const res = await PartnerService.deletePartner(supabase, id);
  if (res.ok) revalidatePath("/admin/partenaires");
  return res;
}
