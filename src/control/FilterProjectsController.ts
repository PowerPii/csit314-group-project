import { Category } from "@/entity/Category";
import { CompanyProfile } from "@/entity/CompanyProfile";
import { Project, type ProjectFilter } from "@/entity/Project";

export type FilterProjectsResult = { ok: true; projects: Project[] } | { ok: false; error: string };

// Customer #5: filter projects by category, design style, designer or budget.
export class FilterProjectsController {
  // The choices for the category and designer drop-downs.
  async getFilterOptions(): Promise<{ categories: Category[]; designers: CompanyProfile[] }> {
    const [categories, designers] = await Promise.all([Category.findAll(), CompanyProfile.findAll()]);
    return { categories, designers };
  }

  async filterProjects(filter: ProjectFilter): Promise<FilterProjectsResult> {
    const { maxBudget } = filter;
    if (maxBudget !== undefined && maxBudget !== null && !(maxBudget > 0)) {
      return { ok: false, error: "Budget must be a positive number." };
    }
    return { ok: true, projects: await Project.filterPublic(filter) };
  }
}
