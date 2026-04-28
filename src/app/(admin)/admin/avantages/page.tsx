import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminAvantagesPanel } from "@/components/admin/admin-avantages-panel";
import { listAvantagesAction } from "@/controllers/avantage.controller";

export default async function AvantagesPage() {
  const res = await listAvantagesAction();
  const avantages = res.ok ? res.data : [];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Gestion des avantages" 
        subtitle="Gérez les avantages offerts aux utilisateurs de la plateforme."
      />
      <AdminAvantagesPanel avantages={avantages} />
    </div>
  );
}
