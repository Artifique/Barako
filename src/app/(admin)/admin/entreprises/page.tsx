import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCompaniesPageClient } from "@/components/admin/admin-companies-page-client";
import { listCompaniesAdminAction } from "@/controllers/company.controller";
import { listUsersAdminAction } from "@/controllers/profile.controller";

export default async function AdminEntreprisesPage() {
  const [companiesRes, ownersRes] = await Promise.all([
    listCompaniesAdminAction(),
    listUsersAdminAction({ role: "company", limit: 200 })
  ]);
  
  const companies = companiesRes.ok ? companiesRes.data : [];
  const companyOwners = ownersRes.ok ? ownersRes.data : [];

  return (
    <AdminCompaniesPageClient companies={companies} companyOwners={companyOwners} />
  );
}
