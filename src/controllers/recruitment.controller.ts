"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function listRecruitmentNeedsAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recruitment_needs")
    .select("*, company:profiles(full_name, company_name)")
    .order("created_at", { ascending: false });
  
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data: data };
}

export async function updateNeedStatusAction(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recruitment_needs")
    .update({ status })
    .eq("id", id);
    
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/besoins");
  return { ok: true as const };
}
