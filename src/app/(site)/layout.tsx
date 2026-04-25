import { PublicNav } from "@/components/layout/public-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { createClient } from "@/lib/supabase/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav user={user} />
      <main className="min-h-[70vh] flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
