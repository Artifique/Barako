export interface Avantage {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AvantageInsertInput {
  title: string;
  description: string;
  image_url?: string | null;
}
