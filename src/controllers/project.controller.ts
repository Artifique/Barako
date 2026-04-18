"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectInsertInput, ProjectStatus } from "@/models";
import * as ProjectService from "@/services/project.service";
import * as ActivityLogService from "@/services/activity-log.service";

export async function listProjectsCatalogAction() {
  const supabase = await createClient();
  return ProjectService.listProjectsCatalog(supabase);
}

export async function createProjectAction(input: ProjectInsertInput) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false as const, error: "Non authentifié" };
  const res = await ProjectService.createProject(supabase, userData.user.id, input);
  if (res.ok) {
    await ActivityLogService.logActivity(supabase, {
      actor_id: userData.user.id,
      action_type: "project_create",
      entity_type: "project",
      entity_id: res.data.id,
      metadata: { title: input.title }
    });
    revalidatePath("/projets");
    revalidatePath("/admin/projets");
  }
  return res;
}

export async function updateProjectStatusAction(projectId: string, status: ProjectStatus) {
  const supabase = await createClient();
  const res = await ProjectService.updateProjectStatus(supabase, projectId, status);
  if (res.ok) revalidatePath("/projets");
  revalidatePath("/admin/projets");
  return res;
}

export async function listProjectsAdminAction() {
  const supabase = await createClient();
  return ProjectService.listProjectsForAdmin(supabase);
}
