import { createClient } from "@/lib/supabase/server";
import { ok, fail } from "@/models/service-result";

export async function logActivity(
  actionType: string,
  entityType: string,
  entityId: string | null = null,
  metadata: Record<string, unknown> | null = null
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("activity_logs").insert({
    actor_id: user?.id,
    action_type: actionType,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });
}

export async function listRecentActivities(supabase: any, limit: number = 50) {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*, actor:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return fail(error.message);
  return ok(data);
}
