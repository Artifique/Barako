import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActivityLog } from "@/models";
import { fail, ok, type ServiceResult } from "@/models/service-result";

export async function logActivity(
  supabase: SupabaseClient,
  entry: Omit<ActivityLog, "id" | "created_at">
): Promise<ServiceResult<void>> {
  const { error } = await supabase.from("activity_logs").insert(entry);
  if (error) return fail(error.message);
  return ok(undefined);
}

export async function listRecentActivities(
  supabase: SupabaseClient,
  limit = 20
): Promise<ServiceResult<ActivityLog[]>> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return fail(error.message);
  return ok((data ?? []) as ActivityLog[]);
}
