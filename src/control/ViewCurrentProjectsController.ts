import { Project } from "@/entity/Project";

// ID #7: view all my current projects.
export class ViewCurrentProjectsController {
  async viewCurrentProjects(designerId: number): Promise<Project[]> {
    return Project.findByDesigner(designerId, "current");
  }
}
