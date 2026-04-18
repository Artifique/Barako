import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProjectInsertInput, ProjectStatus, ProjectWithOwner } from "@/models";
import { fail, ok, type ServiceResult } from "@/models/service-result";

const projectSelect = `
  *,
  profiles ( id, full_name )
`;

export async function listProjectsCatalog(
  supabase: SupabaseClient
): Promise<ServiceResult<ProjectWithOwner[]>> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect)
    .order("created_at", { ascending: false });
  if (error) return fail(error.message);
  return ok((data ?? []) as ProjectWithOwner[]);
}

export async function createProject(
  supabase: SupabaseClient,
  ownerId: string,
  input: ProjectInsertInput
): Promise<ServiceResult<ProjectWithOwner>> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: ownerId,
      title: input.title,
      sector: input.sector,
      short_description: input.short_description ?? null,
      description: input.description ?? null,
      needs_mentoring: input.needs_mentoring ?? false,
      needs_funding: input.needs_funding ?? false
    })
    .select(projectSelect)
    .single();
  if (error) return fail(error.message);
  return ok(data as ProjectWithOwner);
}

export async function updateProjectStatus(
  supabase: SupabaseClient,
  projectId: string,
  status: ProjectStatus
): Promise<ServiceResult<void>> {
  const { error } = await supabase.from("projects").update({ status }).eq("id", projectId);
  if (error) return fail(error.message);
  return ok(undefined);
}

export async function listProjectsForAdmin(supabase: SupabaseClient): Promise<ServiceResult<ProjectWithOwner[]>> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect)
    .order("created_at", { ascending: false });
  if (error) return fail(error.message);
  return ok((data ?? []) as ProjectWithOwner[]);
}
