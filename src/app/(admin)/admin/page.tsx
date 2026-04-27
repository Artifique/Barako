import {
  getAdminStatsAction,
  getAdminSignupsChartAction,
  getRecentActivitiesAction
} from "@/controllers/admin.controller";
import { Card } from "@/components/ui/card";
import { AdminSignupChart } from "@/components/admin/admin-signup-chart";

export default async function AdminDashboardPage() {
  const [stats, activities, chart] = await Promise.all([
    getAdminStatsAction(),
    getRecentActivitiesAction(),
    getAdminSignupsChartAction()
  ]);

  const s = stats.ok ? stats.data : null;
  const acts = activities.ok ? activities.data : [];
  const chartData = chart.ok ? chart.data : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Vue d’ensemble</h1>
        <p className="mt-1 text-sm text-slate-600">Indicateurs clés et tendances des inscriptions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card glowing className="border-t-4 border-t-primary">
          <p className="text-sm font-medium text-slate-500">Utilisateurs</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">{s?.usersCount ?? "—"}</p>
        </Card>
        <Card glowing className="border-t-4 border-t-secondary">
          <p className="text-sm font-medium text-slate-500">Bourses actives</p>
          <p className="mt-2 font-display text-3xl font-bold text-secondary">{s?.activeOffersCount ?? "—"}</p>
        </Card>
        <Card glowing className="border-t-4 border-t-teal-600">
          <p className="text-sm font-medium text-slate-500">Projets</p>
          <p className="mt-2 font-display text-3xl font-bold text-teal-600">{s?.projectsCount ?? "—"}</p>
        </Card>
        <Card glowing className="border-t-4 border-t-amber-600">
          <p className="text-sm font-medium text-slate-500">Candidatures</p>
          <p className="mt-2 font-display text-3xl font-bold text-amber-700">{s?.applicationsCount ?? "—"}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card glowing>
          <h2 className="font-display text-lg font-semibold text-slate-900">Inscriptions (12 mois)</h2>
          <div className="mt-4 h-64">
            <AdminSignupChart data={chartData} />
          </div>
        </Card>
        <Card glowing>
          <h2 className="font-display text-lg font-semibold text-slate-900">Activités récentes</h2>
          <ul className="mt-4 max-h-64 space-y-2 overflow-auto text-xs text-slate-600">
            {acts.map((a: any) => (
              <li key={a.id} className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2">
                <span className="font-mono font-semibold text-primary">{a.action_type}</span> — {a.entity_type}{" "}
                <span className="text-slate-400">{new Date(a.created_at).toLocaleString("fr-FR")}</span>
              </li>
            ))}
            {acts.length === 0 && <li className="text-slate-500">Aucune activité loguée.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
