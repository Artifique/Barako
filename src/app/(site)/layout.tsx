import { PublicNav } from "@/components/layout/public-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/services/settings.service";
import { Toaster } from "react-hot-toast";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userWithRole = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    userWithRole = { id: user.id, role: profile?.role };
  }

  const settingsRes = await getSettings();
  const maintenanceMode = settingsRes.ok && settingsRes.data?.data?.maintenanceMode;

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="top-right" />
      {maintenanceMode && (
        <div className="bg-amber-500 text-white text-center py-2 text-sm font-semibold">
          Le site est actuellement en maintenance.
        </div>
      )}
      <PublicNav user={userWithRole} />
      <main className="min-h-[70vh] flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
