import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

type Variant = "success" | "warning" | "error" | "info" | "gold";

const map: Record<Variant, string> = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  warning: "bg-amber-50 text-amber-900 border-amber-200/80",
  error: "bg-red-50 text-red-800 border-red-200/80",
  info: "bg-sky-50 text-sky-900 border-sky-200/80",
  gold: "bg-amber-50/90 text-amber-950 border-amber-300/70"
};

export function Badge({
  className,
  variant = "info",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium",
        map[variant],
        className
      )}
      {...props}
    />
  );
}
