import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes } from "react";

type FieldVariant = "light" | "dark";

export function Input({
  className,
  variant = "light",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { variant?: FieldVariant }) {
  return (
    <input
      className={cn(
        variant === "dark"
          ? "w-full rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-sm text-light placeholder:text-slate-400 outline-none ring-teal-400/30 focus:border-teal-400/50 focus:ring-2"
          : "input-field",
        className
      )}
      {...props}
    />
  );
}
