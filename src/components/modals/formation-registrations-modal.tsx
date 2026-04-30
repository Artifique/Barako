"use client";

import { useEffect, useState } from "react";
import { AdminModal } from "@/components/admin/admin-modal";
import { getFormationRegistrationsAction } from "@/controllers/formation-registration.controller";

export function FormationRegistrationsModal({ 
    formationId, 
    formationTitle, 
    open, 
    onOpenChange 
}: { 
    formationId: string, 
    formationTitle: string,
    open: boolean, 
    onOpenChange: (open: boolean) => void 
}) {
  const [regs, setRegs] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      getFormationRegistrationsAction(formationId).then(res => {
        if (res.ok) setRegs(res.data);
      });
    }
  }, [open, formationId]);

  return (
    <AdminModal open={open} onOpenChange={onOpenChange} title={`Inscrits à : ${formationTitle}`}>
      <table className="w-full text-sm">
        <thead>
            <tr className="text-left bg-slate-50">
                <th className="p-2">Nom</th>
                <th className="p-2">Email</th>
                <th className="p-2">Date</th>
            </tr>
        </thead>
        <tbody>
            {regs.map((r: any) => (
                <tr key={r.id} className="border-t">
                    <td className="p-2">{r.user?.full_name || "—"}</td>
                    <td className="p-2">{r.user?.email}</td>
                    <td className="p-2">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
            ))}
        </tbody>
      </table>
      {regs.length === 0 && <p className="text-center p-4 text-slate-500">Aucun inscrit pour le moment.</p>}
    </AdminModal>
  );
}
