import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { withCounts, type ProjectWithCount } from "./projectCounts";

// ID #14: see the total number of views on each of my projects.
export class ViewProjectViewsController {
  async viewProjectViews(designerId: number): Promise<ProjectWithCount[]> {
    const projects = await Project.findByDesigner(designerId);
    const counts = await ProjectView.countByProjects(projects.map((p) => p.id));
    return withCounts(projects, counts);
  }
}
