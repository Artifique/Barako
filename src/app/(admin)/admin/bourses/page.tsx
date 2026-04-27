import { listOffersAdminAction } from "@/controllers/job-offer.controller";
import { listCompaniesAdminAction } from "@/controllers/company.controller";
import { AdminJobOffersPanel } from "@/components/admin/admin-job-offers-panel";
import { countApplicationsForJobOfferAction } from "@/controllers/job-application.controller"; // Importer l'action

export default async function AdminOffresPage() {
  const [res, companiesRes] = await Promise.all([listOffersAdminAction(), listCompaniesAdminAction()]);
  let offers = res.ok ? res.data : [];
  const companies = companiesRes.ok ? companiesRes.data : [];

  // Récupérer le nombre de candidatures pour chaque offre
  const offersWithApplicationCount = await Promise.all(
    offers.map(async (offer) => {
      const countRes = await countApplicationsForJobOfferAction(offer.id);
      return {
        ...offer,
        applications_count: countRes.ok ? countRes.data : 0,
      };
    })
  );

  return <AdminJobOffersPanel offers={offersWithApplicationCount} />;
}
