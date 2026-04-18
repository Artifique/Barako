import { PublicNav } from "@/components/layout/public-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav />
      <main className="min-h-[70vh] flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
