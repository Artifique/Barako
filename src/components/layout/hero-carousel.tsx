"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AUTO_MS = 7000;

type Slide = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  href: string;
  cta: string;
  imageSrc?: string; // Added for new images
};

// Updated slides array with images from the public folder
const slides: Slide[] = [
  {
    eyebrow: "Bourse Baarako",
    title: "Des opportunités",
    highlight: "qui vous ressemblent",
    subtitle: "Parcourez des offres vérifiées, postulez en quelques clics et suivez vos candidatures au même endroit.",
    href: "/offres",
    cta: "Explorer les offres",
    imageSrc: "/im1.jpeg", // Assuming .jpg extension, adjust if needed
  },
  {
    eyebrow: "Bourse Tchakèda",
    title: "Passez du projet",
    highlight: "à la réalisation",
    subtitle: "Soumettez votre idée, accédez au mentorat et aux dispositifs de financement adaptés aux jeunes entrepreneurs.",
    href: "/projets",
    cta: "Soumettre un projet",
    imageSrc: "/im2.jpeg", // Assuming .jpg extension, adjust if needed
  },
  {
    eyebrow: "Formations",
    title: "Renforcez vos",
    highlight: "compétences",
    subtitle: "Parcours employabilité et entrepreneuriat pour gagner en confiance sur le marché du travail.",
    href: "/formations",
    cta: "Voir les formations",
    imageSrc: "/im3.jpeg", // Assuming .jpg extension, adjust if needed
  },
  // Note: Using 3 images for 3 slides. If you intended 4 images, please clarify how they should be used (e.g., a 4th slide).
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    []
  );

  useEffect(() => {
    if (paused) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const onRange = (v: number) => {
    setIndex(Math.min(slides.length - 1, Math.max(0, Math.round(v))));
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-300/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid min-h-[300px] md:min-h-[340px] md:grid-cols-[1.15fr_0.85fr]">
        <div className="relative flex flex-col justify-center overflow-hidden p-6 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230c4a6e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          <div
            className="relative transition-opacity duration-500"
            key={index}
            aria-live="polite"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              {slides[index].eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
              {slides[index].title}{" "}
              <span className="bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                {slides[index].highlight}
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 md:text-base">
              {slides[index].subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={slides[index].href}>
                <Button size="lg">{slides[index].cta}</Button>
              </Link>
              <Link href="/auth/inscription">
                <Button size="lg" variant="outline">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right panel displaying the image */}
        <div className={`relative flex min-h-[200px] items-center justify-center p-6 md:min-h-0`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
          <div className="relative w-full max-w-[260px] flex-col items-center drop-shadow-2xl">
            {slides[index].imageSrc && (
              <Image
                src={slides[index].imageSrc}
                alt={`Slider image for slide ${index + 1}`}
                width={260} // Adjust size as needed
                height={260}
                className="h-auto w-full rounded-xl object-contain"
                priority
              />
            )}
            {/* Keep the text below the image if desired */}
            <p className="mt-4 text-center font-display text-sm font-bold text-white/95">
              Insertion & entrepreneuriat au Mali
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/90 px-4 py-3 md:flex-row md:items-center md:gap-4 md:px-6">
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <button
            type="button"
            aria-label="Diapositive précédente"
            onClick={() => go(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary/40 hover:text-primary"
          >
            ‹
          </button>
          <input
            type="range"
            min={0}
            max={slides.length - 1}
            step={1}
            value={index}
            onChange={(e) => onRange(Number(e.target.value))}
            className="hero-range mx-1 h-2 w-full max-w-md cursor-pointer accent-primary md:mx-2"
            aria-label="Choisir une diapositive"
          />
          <button
            type="button"
            aria-label="Diapositive suivante"
            onClick={() => go(1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary/40 hover:text-primary"
          >
            ›
          </button>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-2 md:justify-end">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Aller à la diapositive ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 md:h-2.5 ${
                i === index
                  ? "w-10 bg-gradient-to-r from-primary via-teal-500 to-secondary shadow-sm shadow-primary/25"
                  : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
