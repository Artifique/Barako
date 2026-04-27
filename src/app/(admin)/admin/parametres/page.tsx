import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminAvantagesPanel } from "@/components/admin/admin-avantages-panel";
import { listAvantagesAction } from "@/controllers/avantage.controller";

export default async function AdminParametresPage() {
  const res = await listAvantagesAction();
  const avantages = res.ok ? res.data : [];

  return (
    <div className="space-y-6 text-slate-900">
      <AdminPageHeader
        title="Paramètres"
        subtitle="Configuration avancée de la plateforme."
      />
      <AdminAvantagesPanel avantages={avantages} />
    </div>
  );
}
