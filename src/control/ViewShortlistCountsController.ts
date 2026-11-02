import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { withCounts, type ProjectWithCount } from "./projectCounts";

// ID #15: see how many customers saved (shortlisted) each of my projects.
export class ViewShortlistCountsController {
  async viewShortlistCounts(designerId: number): Promise<ProjectWithCount[]> {
    const projects = await Project.findByDesigner(designerId);
    const counts = await Favourite.countByProjects(projects.map((p) => p.id));
    return withCounts(projects, counts);
  }
}
