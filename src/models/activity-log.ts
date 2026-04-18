export interface ActivityLog {
  id: string;
  actor_id: string | null;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
