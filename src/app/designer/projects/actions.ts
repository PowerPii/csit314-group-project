"use server";

import { revalidatePath } from "next/cache";
import { DeleteProjectController } from "@/control/DeleteProjectController";
import { MarkProjectCompletedController } from "@/control/MarkProjectCompletedController";
import { requireRole } from "@/lib/session";
import type { ActionState } from "../../ui";

// DeleteProjectBoundary (ID #9)
export async function deleteProjectAction(projectId: number, _prev: ActionState): Promise<ActionState> {
  const session = await requireRole("Interior Designer");
  const result = await new DeleteProjectController().deleteProject(session.userAccountId!, projectId);
  if (!result.ok) return { error: result.error };
  revalidatePath("/designer/projects", "layout");
  return {};
}

// MarkProjectCompletedBoundary (ID #11)
export async function markProjectCompletedAction(projectId: number, _prev: ActionState): Promise<ActionState> {
  const session = await requireRole("Interior Designer");
  const result = await new MarkProjectCompletedController().markProjectCompleted(session.userAccountId!, projectId);
  if (!result.ok) return { error: result.error };
  revalidatePath("/designer/projects", "layout");
  return {};
}
