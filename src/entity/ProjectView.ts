import { countPerProject } from "./counts";

// One row per time a project page was opened.
export class ProjectView {
  constructor(
    public readonly id: number,
    public readonly projectId: number,
    public readonly viewerId: number | null,
    public readonly viewedAt: Date,
  ) {}

  // Total views per project id.
  static async countByProjects(projectIds: number[]): Promise<Map<number, number>> {
    return countPerProject("project_view", projectIds);
  }
}
