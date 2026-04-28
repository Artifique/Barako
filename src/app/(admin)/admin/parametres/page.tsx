import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";

export default function AdminParametresPage() {
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
        
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Maintenance</h3>
          <p className="text-sm text-slate-600">Dernière mise à jour : 28 avril 2026</p>
        </Card>
      </div>
    </div>
  );
}
