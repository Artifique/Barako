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
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="p-4">
              <p className="font-semibold">{app.cover_letter ? app.cover_letter.substring(0, 50) + '...' : 'Pas de lettre de motivation'}</p>
              <p className="text-sm text-slate-600">Statut : {app.status}</p>
              {app.cv_url && <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Voir CV</a>}
              {app.has_activity_idea !== undefined && (
                <p className="text-sm text-slate-600">Idée d'activité : {app.has_activity_idea ? "Oui" : "Non"}</p>
              )}
              {app.has_exercised_before !== undefined && (
                <p className="text-sm text-slate-600">Déjà exercé : {app.has_exercised_before ? "Oui" : "Non"}</p>
              )}
              {/* Ajoutez ici d'autres détails du candidat si nécessaire */}
            </Card>
          ))}
        </div>
      )}
    </AdminModal>
  );
}