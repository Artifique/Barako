import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  // Logo colors
  const primaryOrange = "#F57C00"; // Main orange
  const darkBlue = "#0D47A1";     // Dark blue
  const lightOrange = "#FFA726";  // Light orange
  const darkGreen = "#2E8B57";    // Dark green
  const yellowGold = "#FFD54F";   // Yellow/Gold

  return (
    <footer className="mt-20" style={{ background: `linear-gradient(to right, ${primaryOrange}, ${darkBlue})` /* Footer background is now a gradient from orange to dark blue */ }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between">
        {/* Logo and tagline section */}
        <div className="flex gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/30 bg-white/10 shadow-sm">
            <Image src="/logo-barako.jpeg" alt="Baarako" width={56} height={56} className="h-full w-full object-cover p-1" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white">Baarako gèlèya bana</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
              Plateforme d’insertion professionnelle et d’entrepreneuriat des jeunes au Mali.
            </p>
          </div>
        </div>
        {/* Navigation Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
          <Link href="/offres" className="transition hover:text-yellowGold" style={{ color: 'white', '--hover-color': yellowGold } as React.CSSProperties}>
            Offres
          </Link>
          <Link href="/projets" className="transition hover:text-yellowGold" style={{ color: 'white', '--hover-color': yellowGold } as React.CSSProperties}>
            Projets
          </Link>
          <Link href="/formations" className="transition hover:text-yellowGold" style={{ color: 'white', '--hover-color': yellowGold } as React.CSSProperties}>
            Formations
          </Link>
          <Link href="/auth/inscription" className="transition hover:text-yellowGold" style={{ color: 'white', '--hover-color': yellowGold } as React.CSSProperties}>
            Inscription
          </Link>
        </div>
      </div>
      {/* Copyright section */}
      <div className="border-t border-white/20 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Baarako — Tous droits réservés
      </div>
    </footer>
  );
}
