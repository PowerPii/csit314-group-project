"use server";

import { redirect } from "next/navigation";
import { CreateProjectController } from "@/control/CreateProjectController";
import { requireRole } from "@/lib/session";
import { projectFormValues, readProjectForm } from "../form";
import type { ProjectFormState } from "../ProjectForm";

export async function createProjectAction(_prev: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const session = await requireRole("Interior Designer");
  const { details, images } = readProjectForm(formData);

  const result = await new CreateProjectController().createProject(session.userAccountId!, details, images);
  if (!result.ok) return { error: result.error, values: projectFormValues(formData) };
  redirect("/designer/projects");
}
