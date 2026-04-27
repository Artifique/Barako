import { listProjectsAdminAction } from "@/controllers/project.controller";
import { AdminProjetsPanel } from "@/components/admin/admin-projets-panel";

export default async function AdminProjetsPage() {
  const res = await listProjectsAdminAction();
  const projects = res.ok ? res.data : [];

  return <AdminProjetsPanel projects={projects} />;
}
