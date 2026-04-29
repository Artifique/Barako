"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";

import { updateSettingsAction } from "@/controllers/settings.controller";
import { ServiceResult } from "@/models/service-result";
import { Settings } from "@/models/settings";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

// Pas besoin d'importer CardHeader, CardTitle, CardDescription, CardContent, CardFooter car ils ne sont pas exportés par Card.tsx
// Ces éléments seront simulés avec des divs et des classes Tailwind CSS

import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input"; // Assurez-vous que Input est importé si utilisé


type AdminSettingsFormProps = {
  initialSettings: Settings["data"];
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? "Sauvegarde en cours..." : "Sauvegarder les paramètres"}
    </Button>
  );
};

export function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const [siteTitle, setSiteTitle] = useState(initialSettings?.siteTitle || "");
  const [siteDescription, setSiteDescription] = useState(
    initialSettings?.siteDescription || ""
  );
  const [isSiteActive, setIsSiteActive] = useState(
    initialSettings?.isSiteActive || false
  );
  const [maintenanceMode, setMaintenanceMode] = useState(
    initialSettings?.maintenance_mode || false
  );

  const formSubmitAction = async (
    prevState: ServiceResult<Settings | null>,
    formData: FormData
  ) => {
    const updatedData = {
      siteTitle,
      siteDescription,
      isSiteActive,
      maintenance_mode: maintenanceMode,
    };
    return updateSettingsAction(updatedData);
  };

  const [state, formAction] = useFormState<ServiceResult<Settings | null>, FormData>(
    formSubmitAction,
    {
      ok: true,
      data: {
        id: "",
        data: initialSettings,
        created_at: "",
        updated_at: "",
      },
    }
  );

  useEffect(() => {
    if (state.ok && state.data) {
      toast.success("Paramètres sauvegardés avec succès !");
      setSiteTitle(state.data.data.siteTitle || "");
      setSiteDescription(state.data.data.siteDescription || "");
      setIsSiteActive(state.data.data.isSiteActive || false);
    } else if (!state.ok && state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <Card glowing>
        <div className="p-5">
          <h2 className="font-display text-lg font-semibold text-slate-900">Paramètres avancés</h2>
          <p className="mt-1 text-sm text-slate-600">
            Modifier les paramètres de l&apos;application au format JSON. Soyez prudent.
          </p>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700">Titre du site</label>
              <Input
                id="siteTitle"
                name="siteTitle"
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">Description du site</label>
              <Textarea
                id="siteDescription"
                name="siteDescription"
                rows={3}
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="mt-1 block w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isSiteActive"
                name="isSiteActive"
                type="checkbox"
                checked={isSiteActive}
                onChange={(e) => setIsSiteActive(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="isSiteActive" className="text-sm font-medium text-gray-700">Site actif</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="maintenanceMode"
                name="maintenanceMode"
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">Mode maintenance</label>
            </div>
          </div>
        </div>
        <div className="border-t px-6 py-4">
          <SubmitButton />
        </div>
      </Card>
    </form>
  );
}
