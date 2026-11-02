import { Project } from "@/entity/Project";

export type SearchProjectsResult = { ok: true; projects: Project[] } | { ok: false; error: string };

// Customer #4: search all interior design projects by keyword.
export class SearchProjectsController {
  async searchProjects(keyword: string): Promise<SearchProjectsResult> {
    const trimmed = keyword.trim();
    if (trimmed.length < 2) {
      return { ok: false, error: "Enter at least 2 characters." };
    }
    return { ok: true, projects: await Project.searchPublic(trimmed) };
  }
}
