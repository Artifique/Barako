"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormationType } from "@/models";
import * as FormationService from "@/services/formation.service";

export async function listFormationsAction() {
  const supabase = await createClient();
  return FormationService.listFormations(supabase);
}

export async function registerFormationAction(formationId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Connecte-toi pour t’inscrire." };
  const res = await FormationService.registerToFormation(supabase, userData.user.id, formationId);
  if (res.ok) revalidatePath("/formations");
  return res;
}

export async function listFormationsAdminAction() {
  const supabase = await createClient();
  return FormationService.listFormationsForAdmin(supabase);
}

export async function createFormationAdminAction(input: {
  title: string;
  type: FormationType;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  duration_days: number;
  location: string;
  max_places: number;
}) {
  const supabase = await createClient();
  const res = await FormationService.createFormation(supabase, input);
  if (res.ok) revalidatePath("/formations");
  revalidatePath("/admin/formations");
  return res;
}

export async function updateFormationAdminAction(
  id: string,
  input: {
    title: string;
    type: FormationType;
    description?: string | null;
    start_date: string;
    end_date?: string | null;
    duration_days: number;
    location: string;
    max_places: number;
  }
) {
  const supabase = await createClient();
  const res = await FormationService.updateFormation(supabase, id, input);
  if (res.ok) revalidatePath("/formations");
  revalidatePath("/admin/formations");
  return res;
}

export async function deleteFormationAdminAction(id: string) {
  const supabase = await createClient();
  const res = await FormationService.deleteFormation(supabase, id);
  if (res.ok) revalidatePath("/formations");
  revalidatePath("/admin/formations");
  return res;
}
