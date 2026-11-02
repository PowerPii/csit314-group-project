import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { UserAccount } from "@/entity/UserAccount";
import { monthRange } from "./reportPeriods";

export type MonthTotals = { newCustomers: number; newProjects: number; views: number; shortlists: number };
export type MonthlyReport = { month: string; from: Date; to: Date; current: MonthTotals; previous: MonthTotals };
export type MonthlyReportResult = { ok: true; report: MonthlyReport } | { ok: false; error: string };

async function totals(from: Date, to: Date): Promise<MonthTotals> {
  const [newCustomers, newProjects, views, shortlists] = await Promise.all([
    UserAccount.countCreatedBetween(from, to, "Customer"),
    Project.countCreatedBetween(from, to),
    ProjectView.countBetween(from, to),
    Favourite.countBetween(from, to),
  ]);
  return { newCustomers, newProjects, views, shortlists };
}

// PM #10: the month's new customer registrations and activity, compared with the month before.
// `month` is "YYYY-MM" (Singapore time).
export class GenerateMonthlyReportController {
  async generateMonthlyReport(month: string): Promise<MonthlyReportResult> {
    const range = monthRange(month);
    if (!range || range.from.getTime() > Date.now()) {
      return { ok: false, error: "Pick this month or an earlier month." };
    }

    const [current, previous] = await Promise.all([
      totals(range.from, range.to),
      totals(range.previousFrom, range.from),
    ]);
    return { ok: true, report: { month, from: range.from, to: range.to, current, previous } };
  }
}
