import { getAdminStatsAction, getAdminSignupsChartAction } from "@/controllers/admin.controller";
import { Card } from "@/components/ui/card";
import { AdminSignupChart } from "@/components/admin/admin-signup-chart";

export default async function AdminStatsPage() {
  const [stats, chart] = await Promise.all([getAdminStatsAction(), getAdminSignupsChartAction()]);
  const s = stats.ok ? stats.data : null;
  const chartData = chart.ok ? chart.data : [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-light">Statistiques</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card variant="dark">
          <p className="text-sm text-text-muted">Utilisateurs</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">{s?.usersCount ?? "—"}</p>
        </Card>
        <Card variant="dark">
          <p className="text-sm text-text-muted">Candidatures</p>
          <p className="mt-2 font-display text-3xl font-bold text-accent">{s?.applicationsCount ?? "—"}</p>
        </Card>
      </div>
      <Card variant="dark">
        <h2 className="font-display text-lg font-semibold text-light">Inscriptions par mois</h2>
        <div className="mt-4 h-80">
          <AdminSignupChart data={chartData} />
        </div>
      </Card>
    </div>
  );
}
