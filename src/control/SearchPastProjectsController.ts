import { Project, type ProjectSearch } from "@/entity/Project";

export type SearchPastProjectsResult = { ok: true; projects: Project[] } | { ok: false; error: string };

const DAY = 24 * 60 * 60 * 1000;

// ID #13: search my past projects by title, category or completion date.
export class SearchPastProjectsController {
  async searchPastProjects(designerId: number, criteria: ProjectSearch): Promise<SearchPastProjectsResult> {
    const { completedFrom, completedTo } = criteria;
    if (completedFrom && completedTo && completedFrom > completedTo) {
      return { ok: false, error: "The start date must be before the end date." };
    }

    const projects = await Project.searchByDesigner(designerId, {
      ...criteria,
      title: criteria.title?.trim(),
      status: "completed",
      // The end date is a whole day: search up to the start of the next day.
      completedTo: completedTo ? new Date(completedTo.getTime() + DAY) : undefined,
    });
    return { ok: true, projects };
  }
}
