import { createClient } from "@/lib/supabase/server";
import * as PartnerService from "@/services/partner.service";
import { AdminPartenairesPanel } from "@/components/admin/admin-partenaires-panel";

export default async function AdminPartenairesPage() {
  const supabase = await createClient();
  const res = await PartnerService.listPartners(supabase);
  const partners = res.ok ? res.data : [];

  return <AdminPartenairesPanel partners={partners} />;
}
