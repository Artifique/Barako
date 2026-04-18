"use server";

import { createClient } from "@/lib/supabase/server";
import * as AdminStatsService from "@/services/admin-stats.service";
import * as ActivityLogService from "@/services/activity-log.service";

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
