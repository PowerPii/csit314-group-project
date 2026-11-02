import { countPerProject } from "./counts";

// One project saved to one customer's favourite list (a "shortlist").
export class Favourite {
  constructor(
    public readonly id: number,
    public readonly customerId: number,
    public readonly projectId: number,
    public readonly createdAt: Date,
  ) {}

  // Number of customers who saved each project, per project id.
  static async countByProjects(projectIds: number[]): Promise<Map<number, number>> {
    return countPerProject("favourite", projectIds);
  }
}
