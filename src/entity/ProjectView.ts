import { getDb } from "@/lib/supabase";
import { countPerProject } from "./counts";

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
}
