import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

type Variant = "light" | "dark";

export function Card({
  className,
  glowing,
  variant = "light",
  ...props
}: HTMLAttributes<HTMLDivElement> & { glowing?: boolean; variant?: Variant }) {
  const base =
    variant === "dark"
      ? "rounded-card border border-white/10 bg-dark-card/90 p-5 text-light shadow-lg"
      : "rounded-card border border-slate-200/90 bg-white p-5 text-slate-900 shadow-card";

  const glow =
    variant === "dark"
      ? glowing && "hover:border-teal-400/40 hover:shadow-glow hover:-translate-y-0.5"
      : glowing &&
          "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/10";

  return (
    <div
      className={cn("transition-all duration-300", base, glow, className)}
      {...props}
    />
  );
}
