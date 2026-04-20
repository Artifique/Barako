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
  const res = await PartnerService.insertPartner(supabase, input);
  if (res.ok) revalidatePath("/admin/partenaires");
  return res;
}
