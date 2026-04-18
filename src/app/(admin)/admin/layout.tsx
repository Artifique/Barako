import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { signOut } from "@/controllers/auth.controller";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
  { href: "/admin/offres", label: "Offres" },
  { href: "/admin/projets", label: "Projets" },
  { href: "/admin/formations", label: "Formations" },
  { href: "/admin/statistiques", label: "Statistiques" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen bg-dark">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-dark-card/80 p-4 md:block">
        <p className="font-display text-lg font-bold text-light">
          Baarako <span className="text-accent">Admin</span>
        </p>
        <nav className="mt-8 flex flex-col gap-2 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-light/80 transition hover:bg-white/5 hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10 border-t border-white/10 pt-4">
          <Link href="/" className="text-xs text-text-muted hover:text-light">
            ← Site public
          </Link>
          <form action={signOut} className="mt-3">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start px-3 text-light/90 hover:bg-white/10 hover:text-light"
            >
              Déconnexion
            </Button>
          </form>
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:hidden">
          <p className="font-display text-sm font-bold text-light">Admin</p>
          <Link href="/" className="text-xs text-primary">
            Site
          </Link>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
