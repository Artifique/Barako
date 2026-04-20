import { cn } from "@/lib/utils/cn";

export function AdminPageHeader({
  title,
  subtitle,
  className
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white px-5 py-5 shadow-sm shadow-slate-200/40",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary via-teal-600 to-secondary"
        aria-hidden
      />
      <div className="pl-4">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">{subtitle}</p> : null}
      </div>
    </header>
  );
}
