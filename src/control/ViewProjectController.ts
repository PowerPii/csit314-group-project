import { CompanyProfile } from "@/entity/CompanyProfile";
import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";

export type ViewProjectResult =
  | { ok: true; project: Project; company: CompanyProfile | null; isSaved: boolean }
  | { ok: false; error: string };

// Customer #6: view a project's page (gallery, details, duration, designer). Each visit counts as a view.
export class ViewProjectController {
  async viewProject(projectId: number, customerId: number): Promise<ViewProjectResult> {
    const project = await Project.findById(projectId);
    if (!project) {
      return { ok: false, error: "Project not found." };
    }

    const [company, , isSaved] = await Promise.all([
      CompanyProfile.findByDesignerId(project.designerId),
      ProjectView.record(projectId, customerId),
      Favourite.exists(customerId, projectId),
    ]);
    return { ok: true, project, company, isSaved };
  }
}
