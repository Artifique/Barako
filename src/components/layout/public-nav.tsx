"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/controllers/auth.controller"; // Server Action for sign out
import { Button } from "@/components/ui/button";
import { MainNavLinks } from "@/components/layout/main-nav-links";
import { useState, useCallback } from "react"; // Import useState and useCallback
// Removed clsx import and style props from SVG and Buttons

// Define User type for prop, matching what PublicNav expects
interface User {
  id: string;
  // Add other user properties if needed
}

// PublicNav is now a Client Component receiving user data as a prop
export function PublicNav({ user }: { user: User | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Logo colors
  const primaryOrange = "#F57C00"; // Main orange
  const darkBlue = "#0D47A1";     // Dark blue
  const lightOrange = "#FFA726";  // Light orange
  const darkGreen = "#2E8B57";    // Dark green
  const yellowGold = "#FFD4F";   // Yellow/Gold

  const mobileMenuClasses = `fixed inset-0 z-50 bg-white/95 p-4 backdrop-blur-lg transition-transform duration-300 ease-in-out md:hidden ${
    isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
  }`;

  return (
    <> {/* Wrapping the return in a fragment to ensure a single root element */}
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/90 shadow-sm shadow-slate-200/30 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-teal-600 to-secondary" />
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 pt-[calc(0.75rem+4px)]">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <MainNavLinks onCloseMobileMenu={closeMobileMenu} />
            {user && (
              <Link href="/profil" className="text-sm font-medium text-slate-600 transition hover:text-primary">
                Mon profil
              </Link>
            )}
          </nav>

          {/* Authentication buttons and Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Ouvrir le menu mobile"
              aria-expanded={isMobileMenuOpen}
              className="block p-2 md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg" // Corrected xmlns
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
                // Removed style prop from SVG
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Desktop Auth Buttons */}
            {user ? (
              <>
                <Link href="/profil" className="hidden md:inline-block">
                  <Button variant="outline" size="sm">
                    Profil
                  </Button>
                </Link>
                <form action={signOut}>
                  <Button type="submit" variant="ghost" size="sm">
                    Déconnexion
                  </Button>
                </form>
              </>
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
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={mobileMenuClasses} // Using the constructed string
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col items-center gap-8 pt-16">
            {/* Main Nav Links in Mobile Menu */}
            <nav className="flex flex-col items-center gap-6">
              <MainNavLinks onCloseMobileMenu={closeMobileMenu} />
              {user && (
                <Link href="/profil" className="text-sm font-medium text-slate-600 transition hover:text-primary" onClick={closeMobileMenu}>
                  Mon profil
                </Link>
              )}
            </nav>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col items-center gap-4 pb-8">
            {user ? (
              <form action={signOut} className="w-full">
                <Button type="submit" variant="outline" size="lg" className="w-full" style={{ borderColor: primaryOrange, color: primaryOrange }}>
                  Déconnexion
                </Button>
              </form>
            ) : (
              <>
                <Link href="/auth/connexion" className="w-full">
                  <Button variant="outline" size="lg" className="w-full" style={{ borderColor: primaryOrange, color: primaryOrange }}>
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/inscription" className="w-full">
                  <Button size="lg" className="w-full" style={{ backgroundColor: primaryOrange, color: 'white' }}>
                    S’inscrire
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      </>

  );
}
