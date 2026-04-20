import { listFormationsAdminAction } from "@/controllers/formation.controller";
import { AdminFormationsPanel } from "@/components/admin/admin-formations-panel";

export default async function AdminFormationsPage() {
  const res = await listFormationsAdminAction();
  const formations = res.ok ? res.data : [];

  return <AdminFormationsPanel formations={formations} />;
}
