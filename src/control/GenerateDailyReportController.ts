import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { UserAccount } from "@/entity/UserAccount";
import { dayRange } from "./reportPeriods";

export type DailyReport = {
  from: Date;
  to: Date;
  newUsers: number;
  newProjects: number;
  views: number;
  shortlists: number;
  projectsWithNoViews: Project[];
};
export type DailyReportResult = { ok: true; report: DailyReport } | { ok: false; error: string };

// PM #8: the day's new users, new projects, views, shortlists, and projects nobody viewed.
// `date` is the start of the day (Singapore time).
export class GenerateDailyReportController {
  async generateDailyReport(date: Date): Promise<DailyReportResult> {
    if (date.getTime() > Date.now()) {
      return { ok: false, error: "Pick today or an earlier date." };
    }

    const { from, to } = dayRange(date);
    const [newUsers, newProjects, views, shortlists, projectsWithNoViews] = await Promise.all([
      UserAccount.countCreatedBetween(from, to),
      Project.countCreatedBetween(from, to),
      ProjectView.countBetween(from, to),
      Favourite.countBetween(from, to),
      Project.findWithNoViewsBetween(from, to),
    ]);
    return { ok: true, report: { from, to, newUsers, newProjects, views, shortlists, projectsWithNoViews } };
  }
}
