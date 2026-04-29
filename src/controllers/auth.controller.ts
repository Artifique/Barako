"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/models";
import * as ProfileService from "@/services/profile.service"; // Importer le service de profil
import { ProfileUpdateInput } from "@/models/profile"; // Importer le type pour la mise à jour du profil

export type AuthFormState = { error?: string; success?: string };

export async function signInWithEmail(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email et mot de passe requis." };
  
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) return { error: error.message };

  // Récupérer le profil pour vérifier le rôle
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  revalidatePath("/", "layout");

  // Redirection dynamique
  if (profile?.role === "admin") {
    redirect("/admin");
  } else {
    redirect("/profil");
  }
}

export async function signUpWithEmail(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "job_seeker") as UserRole;
  
  console.log("Inscription - Rôle reçu :", role);

  // Champs Candidats
  const dob = String(formData.get("dob") ?? "") || undefined;
  const gender = String(formData.get("gender") ?? "") || undefined;
  const location = String(formData.get("location") ?? "") || undefined;
  const current_situation = String(formData.get("current_situation") ?? "") || undefined;
  const study_level = String(formData.get("study_level") ?? "") || undefined;
  const study_field = String(formData.get("study_field") ?? "") || undefined;
  const has_professional_experience = formData.get("has_professional_experience") === "yes";
  const job_title = String(formData.get("job_title") ?? "") || undefined;
  const experience_duration = Number(formData.get("experience_duration")) || undefined;
  const application_type = formData.getAll("application_type").map(String);
  const skills = formData.getAll("skills").map(String);
  const availability = String(formData.get("availability") ?? "") || undefined;

  const phone = String(formData.get("phone") ?? "") || undefined;

  // Champs Entreprise
  const company_name = String(formData.get("company_name") ?? "") || undefined;
  const company_sector = String(formData.get("company_sector") ?? "") || undefined;
  const company_address = String(formData.get("company_address") ?? "") || undefined;
  const company_phone = String(formData.get("company_phone") ?? "") || undefined;
  const responsible_name = String(formData.get("responsible_name") ?? "") || undefined;
  const responsible_function = String(formData.get("responsible_function") ?? "") || undefined;
  const responsible_phone = String(formData.get("responsible_phone") ?? "") || undefined;
  const company_type = String(formData.get("company_type") ?? "") || undefined;

  const agreement = formData.get("agreement") === "on";


  if (!email || !password || !full_name || !agreement) return { error: "Tous les champs requis n'ont pas été remplis." };

  const supabase = await createClient();

  // Inscription initiale avec Supabase Auth
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, role } } // Les données du profil initial sont passées ici
  });

  if (signUpError) return { error: signUpError.message };

  if (data.user) {
    // Créer un objet ProfileUpdateInput avec les champs supplémentaires
    const profileUpdate: ProfileUpdateInput = {
      full_name,
      phone: role === "company" ? company_phone : phone, // Utiliser le bon champ phone
      dob: dob,
      gender: gender,
      location: location,
      current_situation: current_situation,
      study_level: study_level,
      study_field: study_field,
      has_professional_experience: has_professional_experience,
      job_title: job_title,
      experience_duration: experience_duration,
      application_type: application_type.length > 0 ? application_type : undefined,
      skills: skills.length > 0 ? skills : undefined,
      availability: availability,
      company_name: company_name,
      company_sector: company_sector,
      company_address: company_address,
      responsible_name: responsible_name,
      responsible_function: responsible_function,
      responsible_phone: responsible_phone,
      company_type: company_type,
      agreement: agreement,
    };

    // Mettre à jour le profil avec les champs supplémentaires (utilisation de upsert pour gérer la latence du trigger)
    const cleanedUpdate = Object.fromEntries(
      Object.entries(profileUpdate).filter(([_, v]) => v !== undefined)
    );
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        email,
        ...cleanedUpdate
      })
      .select("*")
      .maybeSingle();

    if (profileError) {
      console.error("Erreur lors de la mise à jour du profil :", profileError.message);
      return { error: "Erreur lors de la création du profil utilisateur." };
    }
  }

  return { success: "Vérifie ta boîte mail pour confirmer le compte si l’option est activée." };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
