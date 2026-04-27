"use client";

import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";

export function StatusModal({ 
  open, 
  onOpenChange, 
  title, 
  message, 
  isError = false 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  title: string; 
  message: string; 
  isError?: boolean 
}) {
  return (
    <AdminModal 
      open={open} 
      onOpenChange={onOpenChange} 
      title={title}
      footer={<Button onClick={() => onOpenChange(false)} className="w-full">Fermer</Button>}
    >
      <div className={`p-4 rounded-xl ${isError ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>
        <p className="text-sm">{message}</p>
      </div>
    </AdminModal>
  );
}
