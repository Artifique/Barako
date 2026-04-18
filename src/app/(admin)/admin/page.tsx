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
      <h1 className="font-display text-2xl font-bold text-light">Tableau de bord</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card variant="dark" className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <p className="text-sm text-text-muted">Utilisateurs</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">{s?.usersCount ?? "—"}</p>
        </Card>
        <Card variant="dark" className="border-secondary/20 bg-gradient-to-br from-secondary/10 to-transparent">
          <p className="text-sm text-text-muted">Offres actives</p>
          <p className="mt-2 font-display text-3xl font-bold text-secondary">{s?.activeOffersCount ?? "—"}</p>
        </Card>
        <Card variant="dark" className="border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-transparent">
          <p className="text-sm text-text-muted">Projets</p>
          <p className="mt-2 font-display text-3xl font-bold text-sky-300">{s?.projectsCount ?? "—"}</p>
        </Card>
        <Card variant="dark" className="border-accent/30 bg-gradient-to-br from-accent/10 to-transparent">
          <p className="text-sm text-text-muted">Candidatures</p>
          <p className="mt-2 font-display text-3xl font-bold text-accent">{s?.applicationsCount ?? "—"}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="dark">
          <h2 className="font-display text-lg font-semibold text-light">Inscriptions (12 mois)</h2>
          <div className="mt-4 h-64">
            <AdminSignupChart data={chartData} />
          </div>
        </Card>
        <Card variant="dark">
          <h2 className="font-display text-lg font-semibold text-light">Activités récentes</h2>
          <ul className="mt-4 max-h-64 space-y-2 overflow-auto text-xs text-light/80">
            {acts.map((a) => (
              <li key={a.id} className="rounded border border-white/5 bg-dark/40 px-2 py-1">
                <span className="text-accent">{a.action_type}</span> — {a.entity_type}{" "}
                <span className="text-text-muted">{new Date(a.created_at).toLocaleString("fr-FR")}</span>
              </li>
            ))}
            {acts.length === 0 && <li className="text-text-muted">Aucune activité loguée.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
