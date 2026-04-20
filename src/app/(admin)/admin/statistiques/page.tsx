import { getAdminStatsAction, getAdminSignupsChartAction } from "@/controllers/admin.controller";
import { Card } from "@/components/ui/card";
import { AdminSignupChart } from "@/components/admin/admin-signup-chart";

export default async function AdminStatsPage() {
  const [stats, chart] = await Promise.all([getAdminStatsAction(), getAdminSignupsChartAction()]);
  const s = stats.ok ? stats.data : null;
  const chartData = chart.ok ? chart.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Statistiques & rapports</h1>
        <p className="mt-1 text-sm text-slate-600">Vue agrégée de l’activité sur la plateforme.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card glowing>
          <p className="text-sm font-medium text-slate-500">Utilisateurs</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">{s?.usersCount ?? "—"}</p>
        </Card>
        <Card glowing>
          <p className="text-sm font-medium text-slate-500">Candidatures</p>
          <p className="mt-2 font-display text-3xl font-bold text-amber-700">{s?.applicationsCount ?? "—"}</p>
        </Card>
      </div>
      <Card glowing>
        <h2 className="font-display text-lg font-semibold text-slate-900">Inscriptions par mois</h2>
        <div className="mt-4 h-80">
          <AdminSignupChart data={chartData} />
        </div>
      </Card>
    </div>
  );
}
