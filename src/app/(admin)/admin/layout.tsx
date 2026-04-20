import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";

export const metadata: Metadata = {
  title: "Console admin — Baarako",
  description: "Pilotage de la plateforme Baarako gèlèya bana",
  robots: { index: false, follow: false }
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return <AdminDashboardShell userEmail={user?.email ?? null}>{children}</AdminDashboardShell>;
}
