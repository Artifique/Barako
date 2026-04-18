import type { ApplicationStatus } from "./enums";

export interface JobApplication {
  id: string;
  job_offer_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  cv_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplicationWithOffer extends JobApplication {
  job_offers: {
    id: string;
    title: string;
    companies: { name: string; logo_url: string | null } | null;
  } | null;
}

export interface JobApplicationInsertInput {
  job_offer_id: string;
  cover_letter?: string | null;
  cv_url?: string | null;
}
