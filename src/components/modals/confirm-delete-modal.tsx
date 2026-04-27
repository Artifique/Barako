"use client";

import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteModal({
  open,
  onOpenChange,
  onConfirm,
  pending,
  title = "Supprimer cet élément ?",
  description = "Cette action est irréversible."
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  pending: boolean;
  title?: string;
  description?: string;
}) {
  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" variant="secondary" onClick={onConfirm} disabled={pending}>
            {pending ? "Suppression…" : "Supprimer"}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-700">{description}</p>
    </AdminModal>
  );
}
