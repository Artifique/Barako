"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

export function AdminModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md"
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && open) {
      if (!el.open) el.showModal();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      className={cn(
        "admin-modal fixed left-1/2 top-1/2 z-[100] flex max-h-[90vh] w-[min(calc(100vw-1.5rem),28rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl shadow-slate-900/20",
        size === "lg" && "w-[min(calc(100vw-1.5rem),42rem)]"
      )}
      onClose={() => onOpenChange(false)}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-sky-50/80 to-white px-5 py-4">
          <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 rounded-lg px-2 text-slate-500 hover:text-slate-800"
            onClick={() => onOpenChange(false)}
          >
            ✕
          </Button>
        </div>
        
        {/* Contenu avec scroll */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-slate-100 bg-slate-50/80 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
