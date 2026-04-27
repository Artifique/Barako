"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CompanyInsertInput } from "@/models";
import * as CompanyService from "@/services/company.service";

export async function getMyCompanyAction() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Non authentifié" };
  return CompanyService.getCompanyByOwner(supabase, userData.user.id);
}

export async function createCompanyAction(input: CompanyInsertInput) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Non authentifié" };
  const res = await CompanyService.createCompany(supabase, userData.user.id, input);
  if (res.ok) revalidatePath("/profil");
  return res;
}

export async function listCompaniesAdminAction() {
  const supabase = await createClient();
  return CompanyService.listCompaniesForAdmin(supabase);
}

export async function createCompanyAsAdminAction(ownerId: string, input: CompanyInsertInput) {
  const supabase = await createClient();
  const res = await CompanyService.createCompany(supabase, ownerId, input);
  if (res.ok) {
    revalidatePath("/admin/entreprises");
    revalidatePath("/admin/bourses");
  }
  return res;
}
