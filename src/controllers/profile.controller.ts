"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProfileUpdateInput } from "@/models";
import * as ProfileService from "@/services/profile.service";

export async function updateMyProfileAction(input: ProfileUpdateInput) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Non authentifié" };
  const res = await ProfileService.updateProfile(supabase, userData.user.id, input);
  if (!res.ok) return res;
  revalidatePath("/profil");
  return res;
}

export async function listUsersAdminAction(filters?: { search?: string; role?: string; limit?: number }) {
  const supabase = await createClient();
  return ProfileService.listProfilesForAdmin(supabase, filters);
}

export async function setUserActiveAction(userId: string, is_active: boolean) {
  const supabase = await createClient();
  const res = await ProfileService.setProfileActive(supabase, userId, is_active);
  if (res.ok) revalidatePath("/admin/utilisateurs");
  return res;
}
