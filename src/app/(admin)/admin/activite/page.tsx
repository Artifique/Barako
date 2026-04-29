import { createClient } from "@/lib/supabase/server";
import * as ActivityLogService from "@/services/activity-log.service";
import { Card } from "@/components/ui/card";

export default async function AdminActivitePage() {
  const supabase = await createClient();
  const res = await ActivityLogService.listRecentActivities(supabase, 80);
  const rows = res.ok ? res.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Journal d’activité</h1>
        <p className="mt-1 text-sm text-slate-600">Dernières actions enregistrées sur la plateforme.</p>
      </div>
      <Card glowing>
        <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-auto text-sm">
          {rows.map((a: any) => (
            <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
              <div>
                <span className="font-mono text-xs font-semibold text-primary">{a.action_type}</span>
                <span className="text-slate-700"> — {a.entity_type}</span>
                {a.entity_id && <span className="text-slate-400"> ({a.entity_id.slice(0, 8)}…)</span>}
              </div>
              <time className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString("fr-FR")}</time>
            </li>
          ))}
          {rows.length === 0 && <li className="py-8 text-center text-slate-500">Aucune entrée pour le moment.</li>}
        </ul>
      </Card>
    </div>
  );
}
