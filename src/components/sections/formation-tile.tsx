import type { FormationWithPlaces } from "@/models";
import { Badge } from "@/components/ui/badge";
import { FormationRegisterButton } from "@/components/forms/formation-register-button";

export function FormationTile({ f, isAuthenticated }: { f: FormationWithPlaces; isAuthenticated: boolean }) {
  const fillPct = Math.min(100, (f.registered_count / Math.max(1, f.max_places)) * 100);
  const isEmployability = f.type === "employability";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-200/60 transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_20px_40px_-16px_rgba(12,74,110,0.15)]">
      <div
        className={`absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b ${isEmployability ? "from-sky-600 via-primary to-teal-600" : "from-amber-500 via-secondary to-primary"}`}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[rgb(12_74_110_/_0.06)] to-teal-500/10 blur-2xl transition duration-500 group-hover:from-[rgb(12_74_110_/_0.1)] group-hover:to-teal-500/15" />

      <div className="relative flex flex-1 flex-col p-6 pl-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isEmployability ? "info" : "gold"}>{isEmployability ? "Employabilité" : "Entrepreneuriat"}</Badge>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Session</span>
        </div>

        <h2 className="mt-3 font-display text-xl font-bold tracking-tight text-slate-900">{f.title}</h2>
        {f.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{f.description}</p>}

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-600 ring-1 ring-slate-200/80">
            <span className="text-slate-400" aria-hidden>
              ◷
            </span>
            {new Date(f.start_date).toLocaleDateString("fr-FR")}
            {f.end_date ? ` → ${new Date(f.end_date).toLocaleDateString("fr-FR")}` : ""}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-600 ring-1 ring-slate-200/80">
            <span className="text-slate-400" aria-hidden>
              ⌖
            </span>
            {f.location}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-600 ring-1 ring-slate-200/80">
            {f.duration_days} jour{f.duration_days > 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-end justify-between gap-2 text-xs">
            <span className="font-medium text-slate-500">Places</span>
            <span className="tabular-nums text-slate-700">
              <span className="font-semibold text-primary">{f.places_left}</span>
              <span className="text-slate-400"> / </span>
              {f.max_places}
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner ring-1 ring-slate-200/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-teal-600 to-secondary transition-all duration-500 ease-out"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        <div className="mt-auto pt-5">
          <FormationRegisterButton formationId={f.id} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </article>
  );
}
