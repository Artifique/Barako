"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/controllers/auth.controller";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const navSections: { title: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    title: "Pilotage",
    items: [
      { href: "/admin", label: "Vue d’ensemble", icon: "▣" },
      { href: "/admin/statistiques", label: "Statistiques & rapports", icon: "◧" }
    ]
  },
  {
  title: "Contenus",
  items: [
    { href: "/admin/avantages", label: "Avantages", icon: "★" },
    { href: "/admin/bourses", label: "Bourses d’emploi", icon: "◆" },
    { href: "/admin/entreprises", label: "Entreprises", icon: "⌂" },
    { href: "/admin/besoins", label: "Besoins Entreprises", icon: "✎" },
    { href: "/admin/projets", label: "Projets", icon: "◇" },
    { href: "/admin/formations", label: "Formations", icon: "◈" },
    { href: "/admin/sponsors", label: "Sponsors", icon: "⚬" }
  ]
  },
  {
  title: "Communauté",
  items: [{ href: "/admin/utilisateurs", label: "Utilisateurs", icon: "◐" }]
  },
  {
  title: "Système",
  items: [
    { href: "/admin/activite", label: "Journal d’activité", icon: "⊞" },
    { href: "/admin/parametres", label: "Paramètres", icon: "⚙" }
  ]
  }];

function NavLink({
  href,
  label,
  icon,
  pathname,
  onNavigate
}: {
  href: string;
  label: string;
  icon: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
        active
          ? "border border-primary/20 bg-gradient-to-r from-sky-50 via-white to-teal-50/90 text-primary shadow-sm shadow-primary/10"
          : "border border-transparent text-slate-700 hover:border-slate-200/90 hover:bg-white hover:text-primary"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs shadow-sm",
          active
            ? "bg-gradient-to-br from-primary to-teal-600 text-white ring-2 ring-white"
            : "border border-slate-200/80 bg-slate-50 text-slate-600"
        )}
      >
        {icon}
      </span>
      <span className="leading-snug">{label}</span>
    </Link>
  );
}

export function AdminDashboardShell({
  userEmail,
  children
}: {
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const sidebar = (
    <div className="relative flex h-full min-h-0 flex-col bg-gradient-to-b from-white via-white to-slate-50/95">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-primary via-teal-600 to-secondary" />
      <div className="relative shrink-0 border-b border-slate-200/90 px-4 py-5">
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="relative h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md shadow-slate-300/40 ring-2 ring-sky-100/80">
            <Image src="/logo-barako.jpeg" alt="Baarako" width={44} height={44} className="h-full w-full object-cover" />
          </span>
          <div>
            <p className="font-display text-base font-bold tracking-tight text-slate-900">Baarako</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">Console admin</p>
          </div>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{section.title}</p>
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-200/90 bg-white/95 p-4 shadow-[0_-4px_24px_rgba(15,23,42,0.04)]">
        {userEmail && (
          <p className="truncate rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[11px] font-medium text-slate-800">
            {userEmail}
          </p>
        )}
        <Link
          href="/"
          className="mt-3 block text-center text-xs font-bold text-primary underline-offset-2 hover:underline"
        >
          Retour au site public
        </Link>
        <form action={signOut} className="mt-3">
          <Button type="submit" variant="outline" size="sm" className="w-full border-slate-300 font-semibold text-slate-800">
            Déconnexion
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="relative z-30 hidden w-72 shrink-0 md:block">
        <div className="sticky top-0 flex h-[100dvh] max-h-[100dvh] flex-col border-r border-slate-200/90 bg-white shadow-lg shadow-slate-300/20">
          {sidebar}
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm md:hidden"
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(100%,20rem)] max-w-full flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full min-h-0 flex-col">{sidebar}</div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 text-slate-900 backdrop-blur md:hidden">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-800 shadow-sm"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
          <span className="font-display text-sm font-bold text-slate-900">Baarako Admin</span>
          <span className="w-10" />
        </header>

        <main className="relative min-h-0 flex-1 overflow-x-hidden bg-[radial-gradient(ellipse_100%_60%_at_0%_-10%,rgba(12,74,110,0.07),transparent_50%)] px-4 py-6 text-slate-900 md:px-8 md:py-8">
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-teal-500/[0.07] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-secondary/[0.06] blur-3xl" />
          <div className="relative mx-auto max-w-6xl text-slate-900 [&_.font-display]:text-slate-900">{children}</div>
        </main>
      </div>
    </div>
  );
}
