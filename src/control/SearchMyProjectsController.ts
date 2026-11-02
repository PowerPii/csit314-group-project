import { Project, type ProjectSearch } from "@/entity/Project";

// ID #10: search my own projects by title, category or status.
export class SearchMyProjectsController {
  async searchMyProjects(designerId: number, criteria: ProjectSearch): Promise<Project[]> {
    return Project.searchByDesigner(designerId, { ...criteria, title: criteria.title?.trim() });
  }
}
