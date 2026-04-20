import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";

export default function AdminParametresPage() {
  return (
    <div className="space-y-6 text-slate-900">
      <AdminPageHeader
        title="Paramètres"
        subtitle="Configuration avancée de la plateforme (extensions prévues)."
      />
      <Card glowing className="max-w-2xl border-slate-200/90 bg-white shadow-md shadow-slate-200/25">
        <p className="text-sm leading-relaxed text-slate-700">
          Cette section accueillera les réglages globaux (e-mails transactionnels, textes légaux, limites d’inscription,
          etc.). Pour l’instant : variables d’environnement Next.js et projet Supabase.
        </p>
      </Card>
    </div>
  );
}
