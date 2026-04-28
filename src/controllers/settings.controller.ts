"use server";

import { getSettings, updateSettings } from "@/services/settings.service";
import { ServiceResult } from "@/models/service-result";
import { Settings } from "@/models/settings";
import { revalidatePath } from "next/cache";

type SettingsActionResponse = ServiceResult<Settings | null>;

export async function getSettingsAction(): Promise<SettingsActionResponse> {
  const res = await getSettings();
  return res;
}

export async function updateSettingsAction(
  updatedData: Record<string, any>
): Promise<SettingsActionResponse> {


  const res = await updateSettings(updatedData);

  if (res.ok) {
    revalidatePath("/admin/parametres");
  }

  return res;
}
