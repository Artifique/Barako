"use server";

import { createClient } from "@/lib/supabase/server";
import * as FormationService from "@/services/formation.service";

export async function getFormationRegistrationsAction(formationId: string) {
  const supabase = await createClient();
  return FormationService.getFormationRegistrations(supabase, formationId);
}
