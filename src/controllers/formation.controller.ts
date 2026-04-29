"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import * as FormationService from "@/services/formation.service";
import type { Formation } from "@/models/formation";

export async function listFormationsAdminAction() {
  const supabase = await createClient();
  return FormationService.listFormations(supabase);
}

export async function listFormationsAction() {
  const supabase = await createClient();
  return FormationService.listFormations(supabase);
}

export async function registerFormationAction(formationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Non authentifié" };
  const res = await FormationService.registerToFormation(supabase, user.id, formationId);
  if (res.ok) revalidatePath("/formations");
  return res;
}

export async function createFormationAdminAction(fd: FormData) {
  const supabase = await createClient();

  const input = {
    title: String(fd.get("title")),
    type: String(fd.get("type")) as any,
    description: String(fd.get("description") || ""),
    start_date: String(fd.get("start_date")),
    max_places: Number(fd.get("max_places")),
  };

  const res = await FormationService.createFormation(supabase, input as any);
  if (res.ok) revalidatePath("/admin/formations");
  return res;
}

export async function updateFormationAdminAction(id: string, fd: FormData) {
  const supabase = await createClient();

  const input: any = {
    title: String(fd.get("title")),
    type: String(fd.get("type")),
    description: String(fd.get("description")),
    start_date: String(fd.get("start_date")),
    max_places: Number(fd.get("max_places")),
  };

  const res = await FormationService.updateFormation(supabase, id, input);
  if (res.ok) revalidatePath("/admin/formations");
  return res;
}

export async function deleteFormationAdminAction(id: string) {
  const supabase = await createClient();
  const res = await FormationService.deleteFormation(supabase, id);
  if (res.ok) revalidatePath("/admin/formations");
  return res;
}
