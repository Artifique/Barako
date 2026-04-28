import { createClient } from "@/lib/supabase/server";
import { ServiceResult } from "@/models/service-result";
import { Settings } from "@/models/settings";

type SettingsResponse = ServiceResult<Settings | null>;

export async function getSettings(): Promise<SettingsResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
    return { ok: false, error: error.message };
  }

  return { ok: true, data: data as Settings };}

export async function updateSettings(
  updatedData: Record<string, any>
): Promise<SettingsResponse> {
  const supabase = await createClient();
  const result = await getSettings();
  if (!result.ok) {
    console.error("Erreur lors de la récupération des paramètres:", result.error);
    return { ok: false, error: result.error };
  }
  const currentSettings = result.data;
  if (!currentSettings) {
    return { ok: false, error: "Paramètres non trouvés pour la mise à jour." };
  }

  const { data, error } = await supabase
    .from("settings")
    .update({ data: updatedData })
    .eq("id", currentSettings.id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    return { ok: false, error: error.message };
  }

  return { ok: true, data: data as Settings };}
