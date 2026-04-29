import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";
import { getSettingsAction } from "@/controllers/settings.controller";
import { SettingsForm } from "@/components/forms/settings-form";

export default async function AdminParametresPage() {
  const res = await getSettingsAction();
  const settings = res.ok ? res.data : null;

  return (
    <div className="space-y-6 text-slate-900">
      <AdminPageHeader
        title="Paramètres"
        subtitle="Gérez la configuration globale et les préférences de la plateforme Baarako."
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Informations système</h3>
          <p className="text-sm text-slate-600">Version: 0.1.0</p>
          <p className="text-sm text-slate-600">Environnement: Production</p>
        </Card>
        
        <Card className="p-6 border-orange-200 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-800">Maintenance & Accès</h3>
          <p className="text-sm text-slate-500 mb-4">
            Contrôlez l'accès public à la plateforme en cas de mise à jour importante.
          </p>
          <SettingsForm initialSettings={settings} />
        </Card>
      </div>
    </div>
  );
}
