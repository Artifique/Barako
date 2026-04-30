"use client";

import { useState, useTransition, useEffect } from "react";
import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listApplicationsForOfferAction } from "@/controllers/job-application.controller"; // Action pour lister les candidatures
import type { JobApplicationWithOffer } from "@/models/job-application"; // Type de candidature
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AdminJobApplicationDetailsModalProps {
  jobOfferId: string;
  jobOfferTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminJobApplicationDetailsModal({
  jobOfferId,
  jobOfferTitle,
  open,
  onOpenChange,
}: AdminJobApplicationDetailsModalProps) {
  const [applications, setApplications] = useState<JobApplicationWithOffer[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      startTransition(async () => {
        const res = await listApplicationsForOfferAction(jobOfferId);
        if (res.ok) {
          setApplications(res.data);
        } else {
          toast.error(res.error);
          onOpenChange(false);
        }
      });
    } else {
      setApplications([]); // Réinitialiser quand la modale est fermée
    }
  }, [open, jobOfferId, router, onOpenChange]);

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Candidatures pour "${jobOfferTitle}"`}
      description={`Total : ${applications.length}`}
      size="lg"
      footer={
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      }
    >
      {isPending ? (
        <div className="flex justify-center py-8">Chargement des candidatures...</div>
      ) : applications.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-600">Aucune candidature pour cette bourse.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-slate-50 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Motivation</th>
              <th className="p-3 text-center">CV</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="p-3 font-medium">{app.applicant?.full_name || "—"}</td>
                <td className="p-3">
                    <div className="flex flex-col">
                        <span>{app.applicant?.email || "—"}</span>
                        <span className="text-xs text-slate-500">{app.applicant?.phone || "Pas de téléphone"}</span>
                    </div>
                </td>
                <td className="p-3 max-w-[200px] truncate">{app.cover_letter || "—"}</td>
                <td className="p-3 text-center">
                    {app.cv_url ? (
                        <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Voir</a>
                    ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminModal>
  );
}