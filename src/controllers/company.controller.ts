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

export async function createCompanyAction(input: any) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Non authentifié" };
  
  // Mise à jour du profil existant avec les informations entreprise
  const { data, error } = await supabase
    .from("profiles")
    .update({
      role: 'company',
      company_name: input.name,
      company_sector: input.sector,
      email: input.email,
      responsible_name: input.responsible_name,
      responsible_function: input.responsible_function,
      responsible_phone: input.responsible_phone,
      company_type: input.company_type
    })
    .eq("id", userData.user.id)
    .select("*")
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/entreprises");
  return { ok: true as const, data: data };
}

export async function listCompaniesAdminAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "company")
    .order("created_at", { ascending: false });

  if (error) return { ok: false as const, error: error.message };
  
  const companies = data.map((p) => ({
    id: p.id,
    name: p.company_name || p.full_name || "Entreprise sans nom",
    owner_id: p.id,
    description: p.bio,
    location: p.company_address,
    responsible_name: p.responsible_name,
    responsible_phone: p.responsible_phone,
    responsible_function: p.responsible_function || null,
    sector: p.company_sector || null,
    email: p.email || null,
    company_type: p.company_type || null,
    website: null,
    logo_url: p.avatar_url,
    created_at: p.created_at,
    updated_at: p.updated_at
  }));

  return { ok: true as const, data: companies };
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

export async function updateCompanyAsAdminAction(id: string, input: any) {
  const supabase = await createClient();
  const res = await CompanyService.updateCompany(supabase, id, input);
  if (res.ok) {
    revalidatePath("/admin/entreprises");
  }
  return res;
}
