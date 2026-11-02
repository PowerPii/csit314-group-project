"use server";

import { revalidatePath } from "next/cache";
import { UpdateProjectController } from "@/control/UpdateProjectController";
import { requireRole } from "@/lib/session";
import { projectFormValues, readProjectForm } from "../../form";
import type { ProjectFormState } from "../../ProjectForm";

export async function updateProjectAction(
  projectId: number,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const session = await requireRole("Interior Designer");
  const { details, images } = readProjectForm(formData);

  const result = await new UpdateProjectController().updateProject(session.userAccountId!, projectId, details, images);
  if (!result.ok) return { error: result.error, values: projectFormValues(formData) };
  revalidatePath(`/designer/projects/${projectId}/edit`);
  return { message: "Project updated.", values: projectFormValues(formData) };
}
