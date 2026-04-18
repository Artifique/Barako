import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200/90 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <Image src="/logo-barako.jpeg" alt="Baarako" width={56} height={56} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-slate-900">Baarako gèlèya bana</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
              Plateforme d’insertion professionnelle et d’entrepreneuriat des jeunes au Mali.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-slate-600">
          <Link href="/offres" className="transition hover:text-primary">
            Offres
          </Link>
          <Link href="/projets" className="transition hover:text-primary">
            Projets
          </Link>
          <Link href="/formations" className="transition hover:text-primary">
            Formations
          </Link>
          <Link href="/auth/inscription" className="transition hover:text-secondary">
            Inscription
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-200/80 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Baarako — Tous droits réservés
      </div>
    </footer>
  );
}
