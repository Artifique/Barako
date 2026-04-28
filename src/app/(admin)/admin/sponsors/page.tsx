import { createClient } from "@/lib/supabase/server";
import * as SponsorService from "@/services/partner.service";
import { AdminSponsorsPanel } from "@/components/admin/admin-partenaires-panel";

export default async function AdminSponsorsPage() {
  const supabase = await createClient();
  const res = await SponsorService.listPartners(supabase);
  const sponsors = res.ok ? res.data : [];

  return <AdminSponsorsPanel sponsors={sponsors} />;
}
