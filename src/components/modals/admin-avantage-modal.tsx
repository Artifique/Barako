"use client";

import { Avantage } from "@/models/avantage"; // Assurez-vous que ce modèle existe
import { AdminModal } from "@/components/admin/admin-modal";
import { AvantageCrudForm } from "@/components/forms/avantage-crud-form";

type AdminAvantageModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAvantage?: Avantage;
  onSubmitSuccess?: () => void;
};

export function AdminAvantageModal({
  open,
  onOpenChange,
  initialAvantage,
  onSubmitSuccess,
}: AdminAvantageModalProps) {
  const isEditMode = !!initialAvantage;

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Modifier l'avantage" : "Ajouter un avantage"}
      footer={null} // Le formulaire gère son propre bouton de soumission
    >
      <AvantageCrudForm
        initialAvantage={initialAvantage}
        onSubmitSuccess={() => {
          onSubmitSuccess?.();
          onOpenChange(false); // Fermer le modal après succès
        }}
      />
    </AdminModal>
  );
}
