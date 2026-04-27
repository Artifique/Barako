"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const mainLinks = [
  { href: "/bourses", label: "Bourses", match: (p: string) => p === "/bourses" || p.startsWith("/bourses/") },
  { href: "/projets", label: "Projets", match: (p: string) => p === "/projets" || p.startsWith("/projets/") },
  { href: "/formations", label: "Formations", match: (p: string) => p === "/formations" || p.startsWith("/formations/") }
];

interface MainNavLinksProps {
  onCloseMobileMenu?: () => void;
}

export function MainNavLinks({ onCloseMobileMenu }: MainNavLinksProps) {
  const pathname = usePathname() ?? "";

  return (
    <>
      {mainLinks.map((l) => {
        const active = l.match(pathname);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onCloseMobileMenu} // Ajout de l'événement onClick
            className={cn(
              "relative text-sm font-medium transition-colors",
              active ? "text-primary" : "text-slate-600 hover:text-primary"
            )}
          >
            {l.label}
            {active && (
              <span
                className="absolute -bottom-1 left-0 right-0 mx-auto h-0.5 max-w-[2.25rem] rounded-full bg-gradient-to-r from-primary via-teal-500 to-secondary"
                aria-hidden
              />
            )}
          </Link>
        );
      })}
    </>
  );
}
