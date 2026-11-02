import { Project } from "@/entity/Project";
import type { ActionResult } from "./validation";

export type MarkProjectCompletedResult = ActionResult;

// ID #11: mark a project completed, moving it from current to past projects.
export class MarkProjectCompletedController {
  async markProjectCompleted(designerId: number, projectId: number): Promise<MarkProjectCompletedResult> {
    const project = await Project.findById(projectId);
    if (!project || project.designerId !== designerId) {
      return { ok: false, error: "Project not found." };
    }
    if (project.status === "completed") {
      return { ok: false, error: "This project is already completed." };
    }
    await project.markCompleted();
    return { ok: true };
  }
}
