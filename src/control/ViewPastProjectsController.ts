import { Project } from "@/entity/Project";

// ID #12: view my past (completed) projects.
export class ViewPastProjectsController {
  async viewPastProjects(designerId: number): Promise<Project[]> {
    return Project.findByDesigner(designerId, "completed");
  }
}
