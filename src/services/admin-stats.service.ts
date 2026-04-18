import type { SupabaseClient } from "@supabase/supabase-js";
import { fail, ok, type ServiceResult } from "@/models/service-result";

export interface AdminDashboardStats {
  usersCount: number;
  activeOffersCount: number;
  projectsCount: number;
  applicationsCount: number;
}

export async function getAdminDashboardStats(
  supabase: SupabaseClient
): Promise<ServiceResult<AdminDashboardStats>> {
  const [users, offers, projects, applications] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("job_offers").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("job_applications").select("id", { count: "exact", head: true })
  ]);
  if (users.error) return fail(users.error.message);
  if (offers.error) return fail(offers.error.message);
  if (projects.error) return fail(projects.error.message);
  if (applications.error) return fail(applications.error.message);
  return ok({
    usersCount: users.count ?? 0,
    activeOffersCount: offers.count ?? 0,
    projectsCount: projects.count ?? 0,
    applicationsCount: applications.count ?? 0
  });
}

export interface SignupsByMonth {
  month: string;
  count: number;
}

/** Agrégation simple côté client à partir des profils (admin uniquement) */
export async function getSignupsLast12Months(
  supabase: SupabaseClient
): Promise<ServiceResult<SignupsByMonth[]>> {
  const since = new Date();
  since.setMonth(since.getMonth() - 11);
  since.setDate(1);
  const { data, error } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", since.toISOString());
  if (error) return fail(error.message);
  const buckets: Record<string, number> = {};
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets[key] = 0;
  }
  for (const row of data ?? []) {
    const d = new Date((row as { created_at: string }).created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (key in buckets) buckets[key] += 1;
  }
  const chart = Object.entries(buckets).map(([month, count]) => ({ month, count }));
  return ok(chart);
}
