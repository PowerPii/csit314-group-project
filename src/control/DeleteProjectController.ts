import { Project } from "@/entity/Project";
import type { ActionResult } from "./validation";

export type DeleteProjectResult = ActionResult;

// ID #9: delete one of my projects (its views and favourites go with it).
export class DeleteProjectController {
  async deleteProject(designerId: number, projectId: number): Promise<DeleteProjectResult> {
    const project = await Project.findById(projectId);
    if (!project || project.designerId !== designerId) {
      return { ok: false, error: "Project not found." };
    }
    await project.delete();
    return { ok: true };
  }
}
