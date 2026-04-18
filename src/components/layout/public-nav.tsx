import Link from "next/link";
import Image from "next/image";
import { createClientOptional } from "@/lib/supabase/server";
import { signOut } from "@/controllers/auth.controller";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/offres", label: "Offres" },
  { href: "/projets", label: "Projets" },
  { href: "/formations", label: "Formations" }
];

export async function PublicNav() {
  const supabase = await createClientOptional();
  let user: { id: string } | null = null;
  let role: string | null = null;
  if (supabase) {
    const {
      data: { user: u }
    } = await supabase.auth.getUser();
    user = u;
    if (u) {
      const { data } = await supabase.from("profiles").select("role").eq("id", u.id).single();
      role = data?.role ?? null;
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 shadow-sm shadow-slate-200/30 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-teal-600 to-secondary" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 pt-[calc(0.75rem+4px)]">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-slate-900">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <Image
              src="/logo-barako.jpeg"
              alt="Baarako"
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span>
            Baarako<span className="text-primary">.</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          {role === "admin" && (
            <Link href="/admin" className="text-sm font-semibold text-secondary">
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                Déconnexion
              </Button>
            </form>
          ) : (
            <>
              <Link href="/auth/connexion">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/inscription">
                <Button size="sm">S’inscrire</Button>
              </Link>
            </>
          )}
          {user && (
            <Link href="/profil">
              <Button variant="outline" size="sm">
                Profil
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
