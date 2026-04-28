"use client";

import { useState } from "react";

import { AdminCompaniesTable } from "@/components/admin/admin-companies-table";
import { AdminCompanyModal } from "@/components/modals/admin-company-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { Company } from "@/models/company";
import { Profile } from "@/models/profile";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { toast } from "react-hot-toast";


type AdminEntreprisesClientPageProps = {
  initialCompanies: Company[];
  initialCompanyOwners: Profile[];
  deleteCompanyAction: (companyId: string) => Promise<{ ok: boolean; error?: string } | { ok: boolean; data: boolean; error: null }>; // Ajusté au type ServiceResult<boolean>
};

export function AdminEntreprisesClientPage({ initialCompanies, initialCompanyOwners, deleteCompanyAction }: AdminEntreprisesClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);
  const [companyToDeleteId, setCompanyToDeleteId] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenModal = (company?: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(undefined);
  };

  const handleDeleteCompany = async (companyId: string) => {
    setIsDeleting(true);
    const res = await deleteCompanyAction(companyId); // Utilisation de la prop
    if (res.ok) {
      toast.success("Entreprise supprimée avec succès !");
    } else {
      toast.error(res.error ?? "Une erreur est survenue lors de la suppression.");
    }
    setIsDeleting(false);
    setCompanyToDeleteId(undefined);
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Entreprises"
        subtitle="Gérer les entreprises enregistrées sur la plateforme."
      />

      <div className="flex justify-end">
        <Button onClick={() => handleOpenModal()}>Ajouter une entreprise</Button>
      </div>

      <AdminCompaniesTable
        companies={initialCompanies} // Utiliser les props
        onEdit={handleOpenModal}
        onDelete={(id) => setCompanyToDeleteId(id)}
      />

      <AdminCompanyModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        initialCompany={editingCompany}
        companyOwners={initialCompanyOwners} // Utiliser les props
        onSubmitSuccess={() => {
          handleCloseModal();
          // La revalidation est gérée dans l'action de création/mise à jour
        }}
      />

      <ConfirmDeleteModal
        open={!!companyToDeleteId}
        onOpenChange={() => setCompanyToDeleteId(undefined)}
        onConfirm={() => handleDeleteCompany(companyToDeleteId!)}
        pending={isDeleting}
        title="Supprimer cette entreprise ?"
        description="Êtes-vous sûr de vouloir supprimer cette entreprise ? Cette action est irréversible."
      />
    </div>
  );
}
