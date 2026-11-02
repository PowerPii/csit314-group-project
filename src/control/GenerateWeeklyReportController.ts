import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import type { CategoryCount, ProjectCount } from "@/entity/reportTypes";
import { UserAccount } from "@/entity/UserAccount";
import { weekRange } from "./reportPeriods";

export type WeeklyReport = {
  from: Date;
  to: Date;
  newUsers: number;
  newProjects: number;
  topCategories: CategoryCount[];
  topViewedProjects: ProjectCount[];
  topSavedProjects: ProjectCount[];
};
export type WeeklyReportResult = { ok: true; report: WeeklyReport } | { ok: false; error: string };

const TOP = 5;

// PM #9: the week's activity, with the most popular categories and the most viewed and saved projects.
// Any day in the week can be passed; the report covers Monday to Sunday (Singapore time).
export class GenerateWeeklyReportController {
  async generateWeeklyReport(weekStart: Date): Promise<WeeklyReportResult> {
    const { from, to } = weekRange(weekStart);
    if (from.getTime() > Date.now()) {
      return { ok: false, error: "Pick this week or an earlier week." };
    }

    const [newUsers, newProjects, topCategories, topViewedProjects, topSavedProjects] = await Promise.all([
      UserAccount.countCreatedBetween(from, to),
      Project.countCreatedBetween(from, to),
      ProjectView.topCategoriesBetween(from, to, TOP),
      ProjectView.topProjectsBetween(from, to, TOP),
      Favourite.topProjectsBetween(from, to, TOP),
    ]);
    return { ok: true, report: { from, to, newUsers, newProjects, topCategories, topViewedProjects, topSavedProjects } };
  }
}
