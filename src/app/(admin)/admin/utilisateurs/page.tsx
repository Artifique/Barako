import { listUsersAdminAction, setUserActiveAction } from "@/controllers/profile.controller";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminUserClient } from "./client";

export default async function AdminUsersPage() {
  const res = await listUsersAdminAction();
  const users = res.ok ? res.data : [];

  return <AdminUserClient initialUsers={users} />;
}
