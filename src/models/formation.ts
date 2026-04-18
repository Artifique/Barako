import type { FormationRegistrationStatus, FormationType } from "./enums";

export interface Formation {
  id: string;
  title: string;
  type: FormationType;
  description: string | null;
  start_date: string;
  end_date: string | null;
  duration_days: number;
  location: string;
  max_places: number;
  created_at: string;
  updated_at: string;
}

export interface FormationWithPlaces extends Formation {
  registered_count: number;
  places_left: number;
}

export interface FormationRegistration {
  id: string;
  formation_id: string;
  user_id: string;
  status: FormationRegistrationStatus;
  created_at: string;
}
