import type { ProjectStatus } from "./enums";

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  sector: string;
  short_description: string | null;
  description: string | null;
  status: ProjectStatus;
  needs_mentoring: boolean;
  needs_funding: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithOwner extends Project {
  profiles: { full_name: string | null; id: string } | null;
}

export interface ProjectInsertInput {
  title: string;
  sector: string;
  short_description?: string | null;
  description?: string | null;
  needs_mentoring?: boolean;
  needs_funding?: boolean;
}
