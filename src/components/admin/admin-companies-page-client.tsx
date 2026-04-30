"use client";

import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCompaniesTable } from "@/components/admin/admin-companies-table";
import { AdminCompanyModal } from "@/components/modals/admin-company-modal";
import { Company } from "@/models/company";
import { Profile } from "@/models/profile";
import { Button } from "@/components/ui/button";

export function AdminCompaniesPageClient({ companies, companyOwners }: { companies: Company[], companyOwners: Profile[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();

  const handleOpenAddModal = () => {
    setEditingCompany(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = (companyId: string) => {
    // Logique de suppression à implémenter
    console.log("Supprimer", companyId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminPageHeader 
          title="Gestion des entreprises" 
          subtitle="Consultez et gérez les entreprises partenaires."
        />
      </div>
      <AdminCompaniesTable companies={companies} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
