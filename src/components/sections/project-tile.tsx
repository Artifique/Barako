import type { ProjectWithOwner } from "@/models";
import { Badge } from "@/components/ui/badge";

const statusLabels: Record<string, string> = {
  submitted: "Soumis",
  under_review: "En revue",
  accepted: "Accepté",
  mentoring: "Mentorat",
  funded: "Financé",
  rejected: "Refusé"
};

export function ProjectTile({ p }: { p: ProjectWithOwner }) {
  const statusFr = statusLabels[p.status] ?? p.status;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-200/60 transition duration-300 hover:-translate-y-0.5 hover:border-teal-600/25 hover:shadow-[0_20px_40px_-16px_rgba(13,148,136,0.12)]">
      <div className="pointer-events-none absolute -right-12 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/15 to-[rgb(12_74_110_/_0.06)] blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <Badge variant="gold" className="shrink-0">
          {p.sector}
        </Badge>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200/80">
          {statusFr}
        </span>
      </div>

      <h2 className="relative mt-4 font-display text-lg font-bold leading-snug tracking-tight text-slate-900">{p.title}</h2>
      <p className="relative mt-1.5 flex items-center gap-2 text-xs text-slate-500">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-teal-600/10 text-[10px] font-bold text-primary">
          {(p.profiles?.full_name ?? "?").charAt(0).toUpperCase()}
        </span>
        <span className="truncate">{p.profiles?.full_name ?? "Porteur de projet"}</span>
      </p>

      <p className="relative mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
        {p.short_description ?? p.description ?? "—"}
      </p>

      <div className="relative mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {p.needs_mentoring && <Badge variant="success">Mentorat</Badge>}
        {p.needs_funding && <Badge variant="warning">Financement</Badge>}
        {!p.needs_mentoring && !p.needs_funding && (
          <span className="text-xs italic text-slate-400">Accompagnement à définir</span>
        )}
      </div>
    </article>
  );
}
