"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateNeedStatusAction } from "@/controllers/recruitment.controller";
import toast from "react-hot-toast";

export function AdminBesoinsClient({ initialNeeds }: { initialNeeds: any[] }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedNeeds = initialNeeds.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "traité" ? "non-traité" : "traité";
    const res = await updateNeedStatusAction(id, newStatus);
    if (res.ok) {
        toast.success("Statut mis à jour");
        router.refresh();
    } else {
        toast.error("Erreur mise à jour");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Besoins Entreprises" subtitle="Gestion des besoins exprimés par les entreprises." />
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 uppercase text-xs">
            <tr>
              <th className="p-3">Entreprise</th>
              <th className="p-3">Poste</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedNeeds.map((n: any) => (
              <tr key={n.id} className="border-t">
                <td className="p-3 font-medium">{n.company?.company_name || n.company?.full_name || "—"}</td>
                <td className="p-3">{n.poste}</td>
                <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${n.status === 'traité' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {n.status}
                    </span>
                </td>
                <td className="p-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => toggleStatus(n.id, n.status)}>
                        Basculer statut
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex gap-2 border-t">
          <Button disabled={page === 1} onClick={() => setPage(page-1)}>Précédent</Button>
          <Button disabled={page * itemsPerPage >= initialNeeds.length} onClick={() => setPage(page+1)}>Suivant</Button>
        </div>
      </Card>
    </div>
  );
}
