"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/controllers/auth.controller";
import { Button } from "@/components/ui/button";
import { MainNavLinks } from "@/components/layout/main-nav-links";
import { useState, useCallback } from "react";

interface User {
  id: string;
  role?: string;
}

export function PublicNav({ user }: { user: User | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const mobileMenuClasses = `fixed inset-0 z-50 bg-white/95 p-4 backdrop-blur-lg transition-transform duration-300 ease-in-out md:hidden ${
    isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
  }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/90 shadow-sm shadow-slate-200/30 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-teal-600 to-secondary" />
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-slate-900">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
              <Image src="/logo-barako.jpeg" alt="Baarako" width={40} height={40} className="h-full w-full object-cover" priority />
            </span>
            <span>Baarako<span className="text-primary">.</span></span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <MainNavLinks onCloseMobileMenu={closeMobileMenu} />
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/profil">
                  <Button variant="ghost" size="sm">Profil</Button>
                </Link>
                {user.role === 'company' && (
                  <Link href="/profil/avantages">
                    <Button variant="ghost" size="sm">Mes Avantages</Button>
                  </Link>
                )}
                <form action={signOut}>
                  <Button type="submit" variant="ghost" size="sm">Déconnexion</Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/connexion">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link href="/auth/inscription">
                  <Button size="sm" className="bg-primary hover:bg-orange-600 text-white">Inscription</Button>
                </Link>
              </>
            )}
          </div>

          <button type="button" onClick={toggleMobileMenu} className="block p-2 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>
      <div className={mobileMenuClasses}>
        <div className="flex h-full flex-col p-4">
          <div className="flex justify-end">
            <button onClick={closeMobileMenu} className="p-2">✕</button>
          </div>
          <nav className="flex flex-col items-center gap-6 pt-10">
            <MainNavLinks onCloseMobileMenu={closeMobileMenu} />
            {user ? (
              <>
                <Link href="/profil" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full">Profil</Button>
                </Link>
                {user.role === 'company' && (
                  <Link href="/profil/avantages" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full">Mes Avantages</Button>
                  </Link>
                )}
                <form action={signOut} className="w-full" onSubmit={closeMobileMenu}>
                  <Button type="submit" variant="ghost" className="w-full">Déconnexion</Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/connexion" className="w-full" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full">Connexion</Button>
                </Link>
                <Link href="/auth/inscription" className="w-full" onClick={closeMobileMenu}>
                  <Button className="w-full bg-primary text-white">Inscription</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
