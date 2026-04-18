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
}

export interface ProfileUpdateInput {
  full_name?: string;
  phone?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
}
