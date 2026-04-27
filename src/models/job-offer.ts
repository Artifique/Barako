import type { JobOfferStatus } from "./enums";

export interface JobOffer {
  id: string;
  company_id: string | null;
  title: string;
  description: string | null;
  missions: string | null;
  requirements: string | null;
  benefits: string | null;
  contract_type: string;
  sector: string | null;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  expires_at: string | null;
  status: JobOfferStatus;
  type_bourse: "regular" | "tchakeda";
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobOfferWithCompany extends JobOffer {
  companies: {
    id: string;
    name: string;
    logo_url: string | null;
    location: string | null;
  } | null;
  applications_count?: number;
}

export interface JobOfferInsertInput {
  company_id?: string | null;
  title: string;
  description?: string | null;
  missions?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  contract_type?: string;
  sector?: string | null;
  location?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  currency?: string;
  expires_at?: string | null;
  status?: JobOfferStatus;
  type_bourse?: "regular" | "tchakeda";
  image_url?: string | null;
}

export interface JobOfferFilters {
  search?: string;
  sector?: string;
  location?: string;
  contract_type?: string;
}
