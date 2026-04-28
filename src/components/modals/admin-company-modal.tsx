"use client";

import { CompanyCrudForm } from "@/components/forms/company-crud-form";
import { AdminModal } from "@/components/admin/admin-modal";
import { Company } from "@/models/company";
import { Profile } from "@/models/profile";

type AdminCompanyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCompany?: Company;
  companyOwners: Profile[];
  onSubmitSuccess: () => void;
};

export function AdminCompanyModal({
  open,
  onOpenChange,
  initialCompany,
  companyOwners,
  onSubmitSuccess,
}: AdminCompanyModalProps) {
  const isEditMode = !!initialCompany;

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Modifier l'entreprise" : "Ajouter une entreprise"}
      footer={null} // Le formulaire gère son propre bouton de soumission
    >
      <CompanyCrudForm
        initialCompany={initialCompany}
        companyOwners={companyOwners}
        onSubmitSuccess={() => {
          onSubmitSuccess();
          onOpenChange(false); // Fermer le modal après succès
        }}
      />
    </AdminModal>
  );
}
