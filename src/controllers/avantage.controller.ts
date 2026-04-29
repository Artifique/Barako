"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import * as AvantageService from "@/services/avantage.service";
import { logActivity } from "@/services/activity-log.service";

export async function listAvantagesAction() {
  const supabase = await createClient();
  return AvantageService.listAvantages(supabase);
}

export async function createAvantageAction(input: { title: string; description: string; image_url?: string }) {
  const supabase = await createClient();
  const res = await AvantageService.createAvantage(supabase, input);
  if (res.ok) {
    await logActivity("CREATE", "AVANTAGE", res.data.id, { title: input.title });
    revalidatePath("/admin/avantages");
  }
  return res;
}

export async function updateAvantageAction(id: string, input: { title: string; description: string; image_url?: string }) {
  const supabase = await createClient();
  const res = await AvantageService.updateAvantage(supabase, id, input);
  if (res.ok) {
    await logActivity("UPDATE", "AVANTAGE", id, { title: input.title });
    revalidatePath("/admin/avantages");
  }
  return res;
}

export async function deleteAvantageAction(id: string) {
  const supabase = await createClient();
  const res = await AvantageService.deleteAvantage(supabase, id);
  if (res.ok) {
    await logActivity("DELETE", "AVANTAGE", id);
    revalidatePath("/admin/avantages");
  }
  return res;
}
