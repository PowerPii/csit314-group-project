import { getDb } from "@/lib/supabase";
import { countBetween, countPerProject, topRows } from "./counts";
import type { CategoryCount, ProjectCount } from "./reportTypes";

// One row per time a project page was opened.
export class ProjectView {
  constructor(
    public readonly id: number,
    public readonly projectId: number,
    public readonly viewerId: number | null,
    public readonly viewedAt: Date,
  ) {}

  // Customer #6: one more view of the project. viewerId is null for a visitor who is not logged in.
  static async record(projectId: number, viewerId: number | null): Promise<void> {
    const { error } = await getDb().from("project_view").insert({ project_id: projectId, viewer_id: viewerId });
    if (error) throw new Error(`ProjectView.record failed: ${error.message}`);
  }

  // Total views per project id.
  static async countByProjects(projectIds: number[]): Promise<Map<number, number>> {
    return countPerProject("project_view", projectIds);
  }

  static async countBetween(from: Date, to: Date): Promise<number> {
    return countBetween("project_view", "viewed_at", from, to);
  }

  // The most viewed projects in [from, to).
  static async topProjectsBetween(from: Date, to: Date, limit: number): Promise<ProjectCount[]> {
    const rows = await topRows<{ project_id: number; title: string; count: number }>("top_viewed_projects", from, to, limit);
    return rows.map((r) => ({ projectId: r.project_id, title: r.title, count: Number(r.count) }));
  }

  // The categories whose projects were viewed most in [from, to).
  static async topCategoriesBetween(from: Date, to: Date, limit: number): Promise<CategoryCount[]> {
    const rows = await topRows<{ category_id: number; name: string; count: number }>("top_viewed_categories", from, to, limit);
    return rows.map((r) => ({ categoryId: r.category_id, name: r.name, count: Number(r.count) }));
  }
}
