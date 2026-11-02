import { Category } from "@/entity/Category";
import { CompanyProfile } from "@/entity/CompanyProfile";
import { Project, type ProjectFilter } from "@/entity/Project";

export type FilterProjectsResult = { ok: true; projects: Project[] } | { ok: false; error: string };

export type FilterOptions = { categories: Category[]; styles: string[]; designers: CompanyProfile[] };

// Customer #5: filter projects by category, design style, designer or budget.
export class FilterProjectsController {
  // The choices for the category, style and designer drop-downs. Each list only offers
  // values that still have projects once the *other* filters are applied, so the filters
  // narrow each other. A drop-down's own choice is always kept so it can be changed back.
  async getFilterOptions(filter: ProjectFilter = {}): Promise<FilterOptions> {
    const { categoryId, style, designerId, maxBudget } = filter;
    const [categories, designers, byCategory, byStyle, byDesigner] = await Promise.all([
      Category.findAll(),
      CompanyProfile.findAll(),
      Project.filterPublic({ style, designerId, maxBudget }),
      Project.filterPublic({ categoryId, designerId, maxBudget }),
      Project.filterPublic({ categoryId, style, maxBudget }),
    ]);

    const categoryIds = new Set(byCategory.map((p) => p.categoryId));
    if (categoryId) categoryIds.add(categoryId);
    const styles = new Set(byStyle.flatMap((p) => p.styleTags));
    if (style) styles.add(style);
    const designerIds = new Set(byDesigner.map((p) => p.designerId));
    if (designerId) designerIds.add(designerId);

    return {
      categories: categories.filter((c) => categoryIds.has(c.id)),
      styles: [...styles].sort(),
      designers: designers.filter((d) => designerIds.has(d.designerId)),
    };
  }

  async filterProjects(filter: ProjectFilter): Promise<FilterProjectsResult> {
    const { maxBudget } = filter;
    if (maxBudget !== undefined && maxBudget !== null && !(maxBudget > 0)) {
      return { ok: false, error: "Budget must be a positive number." };
    }
    return { ok: true, projects: await Project.filterPublic(filter) };
  }
}
