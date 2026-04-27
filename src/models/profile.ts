import type { UserRole } from "./enums";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Champs Candidats
  dob?: string; // Date de naissance
  gender?: string; // Sexe
  location?: string; // Commune / Quartier
  current_situation?: string; // Situation actuelle
  study_level?: string; // Niveau d'étude
  study_field?: string; // Domaine d'étude
  has_professional_experience?: boolean; // A de l'expérience professionnelle
  job_title?: string; // Métier
  experience_duration?: number; // Durée d'expérience
  application_type?: string[]; // Type de candidature (peut être multiple)
  skills?: string[]; // Compétences (peut être multiple)
  availability?: string; // Disponibilité

  // Champs Entreprise
  company_name?: string; // Nom de l'entreprise
  company_sector?: string; // Secteur d'activité
  company_address?: string; // Adresse de l'entreprise
  company_phone?: string; // Téléphone de l'entreprise
  responsible_name?: string; // Nom et prénom du responsable
  responsible_function?: string; // Fonction du responsable
  responsible_phone?: string; // Téléphone du responsable
  company_type?: string; // Type d'entreprise

  // Engagement
  agreement?: boolean; // Acceptation des termes et conditions
}

export interface ProfileUpdateInput {
  full_name?: string;
  phone?: string | null;
  bio?: string | null;
  avatar_url?: string | null;

  // Champs Candidats
  dob?: string;
  gender?: string;
  location?: string;
  current_situation?: string;
  study_level?: string;
  study_field?: string;
  has_professional_experience?: boolean;
  job_title?: string;
  experience_duration?: number;
  application_type?: string[];
  skills?: string[];
  availability?: string;

  // Champs Entreprise
  company_name?: string;
  company_sector?: string;
  company_address?: string;
  company_phone?: string;
  responsible_name?: string;
  responsible_function?: string;
  responsible_phone?: string;
  company_type?: string;

  // Engagement
  agreement?: boolean;
}
