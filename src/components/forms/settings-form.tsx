"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateSettingsAction } from "@/controllers/settings.controller";
import { Settings } from "@/models/settings";

type SettingsFormProps = {
  initialSettings: Settings | null;
};

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isMaintenance, setIsMaintenance] = useState(
    initialSettings?.data?.maintenance_mode === true
  );
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    initialSettings?.data?.maintenance_message || "La plateforme est actuellement en maintenance. Nous serons de retour très bientôt."
  );
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    const res = await updateSettingsAction({
      ...(initialSettings?.data || {}),
      maintenance_mode: isMaintenance,
      maintenance_message: maintenanceMessage,
    });

    setIsPending(false);

    if (res.ok) {
      toast.success("Paramètres de maintenance mis à jour");
    } else {
      toast.error(res.error || "Erreur lors de la mise à jour");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <input 
          type="checkbox" 
          id="maintenance" 
          checked={isMaintenance}
          onChange={(e) => setIsMaintenance(e.target.checked)}
          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="maintenance" className="text-sm font-semibold text-slate-800 cursor-pointer">
          Activer le mode maintenance
        </label>
      </div>

      {isMaintenance && (
        <div className="space-y-2 pt-2 transition-all">
          <label className="block text-sm font-medium text-slate-700">
            Message de notification aux usagers
          </label>
          <Textarea 
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            rows={3}
            placeholder="Message qui sera affiché aux utilisateurs pendant la maintenance..."
            className="resize-none"
            required={isMaintenance}
          />
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Sauvegarde en cours..." : "Sauvegarder les paramètres"}
      </Button>
    </form>
  );
}
