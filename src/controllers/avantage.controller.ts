"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import * as AvantageService from "@/services/avantage.service";

export async function listAvantagesAction() {
  const supabase = await createClient();
  return AvantageService.listAvantages(supabase);
}

export async function createAvantageAction(input: { title: string; description: string; icon?: string; display_order?: number }) {
  const supabase = await createClient();
  const res = await AvantageService.createAvantage(supabase, input);
  if (res.ok) revalidatePath("/admin/parametres");
  return res;
}

export async function updateAvantageAction(id: string, input: any) {
  const supabase = await createClient();
  const res = await AvantageService.updateAvantage(supabase, id, input);
  if (res.ok) revalidatePath("/admin/parametres");
  return res;
}

export async function deleteAvantageAction(id: string) {
  const supabase = await createClient();
  const res = await AvantageService.deleteAvantage(supabase, id);
  if (res.ok) revalidatePath("/admin/parametres");
  return res;
}
