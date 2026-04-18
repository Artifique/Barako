export interface Company {
  id: string;
  owner_id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  location: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyInsertInput {
  name: string;
  logo_url?: string | null;
  description?: string | null;
  location?: string | null;
  website?: string | null;
}
