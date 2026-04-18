import type { JobOfferStatus } from "./enums";

export interface JobOffer {
  id: string;
  company_id: string;
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
}

export interface JobOfferInsertInput {
  company_id: string;
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
}

export interface JobOfferFilters {
  search?: string;
  sector?: string;
  location?: string;
  contract_type?: string;
}
