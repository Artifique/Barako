import { listOffersAdminAction } from "@/controllers/job-offer.controller";
import { listCompaniesAdminAction } from "@/controllers/company.controller";
import { AdminJobOffersPanel } from "@/components/admin/admin-job-offers-panel";

export default async function AdminOffresPage() {
  const [res, companiesRes] = await Promise.all([listOffersAdminAction(), listCompaniesAdminAction()]);
  const offers = res.ok ? res.data : [];
  const companies = companiesRes.ok ? companiesRes.data : [];

  return <AdminJobOffersPanel offers={offers} companies={companies} />;
}
