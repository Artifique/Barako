"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitRecruitmentNeedAction(fd: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Non authentifié" };

  const conditions = fd.getAll("conditions") as string[];
  
  const input = {
    company_id: user.id,
    poste: String(fd.get("poste")),
    nombre: Number(fd.get("nombre")),
    niveau: String(fd.get("niveau")),
    experience: String(fd.get("experience")),
    competences: String(fd.get("competences")),
    conditions: conditions,
    salaire: String(fd.get("salaire")),
    lieu: String(fd.get("lieu")),
    status: 'non-traité'
  };

  const { error } = await supabase.from("recruitment_needs").insert(input);
  if (error) return { ok: false as const, error: error.message };
  
  return { ok: true as const };
}

export async function listRecruitmentNeedsAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recruitment_needs")
    .select("*, company:profiles(full_name, company_name)")
    .order("created_at", { ascending: false });
  
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, data: data };
}

export async function updateNeedStatusAction(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recruitment_needs")
    .update({ status })
    .eq("id", id);
    
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/besoins");
  return { ok: true as const };
}
