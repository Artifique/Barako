"use server";

import { createClient } from "@/lib/supabase/server";
import * as AdminStatsService from "@/services/admin-stats.service";
import * as ActivityLogService from "@/services/activity-log.service";
import * as ProfileService from "@/services/profile.service";
import { revalidatePath } from "next/cache";

export async function getAdminStatsAction() {
  const supabase = await createClient();
  return AdminStatsService.getAdminDashboardStats(supabase);
}

export async function getAdminSignupsChartAction() {
  const supabase = await createClient();
  return AdminStatsService.getSignupsLast12Months(supabase);
}

export async function getRecentActivitiesAction() {
  const supabase = await createClient();
  return ActivityLogService.listRecentActivities(supabase, 25);
}

export async function updateProfileAdminAction(id: string, input: any) {
  const supabase = await createClient();
  const res = await ProfileService.updateProfile(supabase, id, input);
  if (res.ok) revalidatePath("/admin/utilisateurs");
  return res;
}

export async function deleteUserAdminAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/utilisateurs");
  return { ok: true as const };
}

export async function createUserAdminAction(input: any) {
  const supabase = await createClient();
  const { error } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    user_metadata: { full_name: input.full_name, role: input.role },
    email_confirm: true
  });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/utilisateurs");
  return { ok: true as const };
}
