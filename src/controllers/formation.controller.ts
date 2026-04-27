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
  const imageFile = fd.get("image") as File;
  let image_url = null;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${crypto.randomUUID()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from('formation-images').upload(fileName, imageFile);
    if (!uploadError) {
      const { data } = supabase.storage.from('formation-images').getPublicUrl(fileName);
      image_url = data.publicUrl;
    }
  }

  const input = {
    title: String(fd.get("title")),
    type: String(fd.get("type")) as any,
    description: String(fd.get("description") || ""),
    start_date: String(fd.get("start_date")),
    max_places: Number(fd.get("max_places")),
    instructor_name: String(fd.get("instructor_name") || ""),
    instructor_bio: String(fd.get("instructor_bio") || ""),
    level: String(fd.get("level") || ""),
    prerequisites: String(fd.get("prerequisites") || ""),
    image_url
  };

  const res = await FormationService.createFormation(supabase, input as any);
  if (res.ok) revalidatePath("/admin/formations");
  return res;
}

export async function updateFormationAdminAction(id: string, fd: FormData) {
  const supabase = await createClient();
  const imageFile = fd.get("image") as File;
  let image_url = undefined;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${crypto.randomUUID()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage.from('formation-images').upload(fileName, imageFile);
    if (!uploadError) {
      const { data } = supabase.storage.from('formation-images').getPublicUrl(fileName);
      image_url = data.publicUrl;
    }
  }

  const input: any = {
    title: String(fd.get("title")),
    type: String(fd.get("type")),
    description: String(fd.get("description")),
    start_date: String(fd.get("start_date")),
    max_places: Number(fd.get("max_places")),
    instructor_name: String(fd.get("instructor_name")),
    instructor_bio: String(fd.get("instructor_bio")),
    level: String(fd.get("level")),
    prerequisites: String(fd.get("prerequisites")),
  };
  if (image_url) input.image_url = image_url;

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
