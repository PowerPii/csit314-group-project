import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GenerateWeeklyReportController } from "@/control/GenerateWeeklyReportController";
import { parseSgDate } from "@/control/reportPeriods";
import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { UserAccount } from "@/entity/UserAccount";

describe("GenerateWeeklyReportController.generateWeeklyReport (PM #9)", () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date("2026-11-04T04:00:00Z"), toFake: ["Date"] }));
  afterEach(() => vi.useRealTimers());

  it("reports the Monday-to-Sunday week with the top 5 categories and projects", async () => {
    const monday = parseSgDate("2026-10-26")!;
    const nextMonday = parseSgDate("2026-11-02")!;
    vi.spyOn(UserAccount, "countCreatedBetween").mockResolvedValue(10);
    vi.spyOn(Project, "countCreatedBetween").mockResolvedValue(7);
    const cats = vi.spyOn(ProjectView, "topCategoriesBetween").mockResolvedValue([{ categoryId: 1, name: "Modern Kitchen", count: 40 }]);
    vi.spyOn(ProjectView, "topProjectsBetween").mockResolvedValue([{ projectId: 3, title: "Loft", count: 12 }]);
    vi.spyOn(Favourite, "topProjectsBetween").mockResolvedValue([{ projectId: 4, title: "Attic", count: 5 }]);

    // Any day in the week gives the same report: Wednesday 28 Oct.
    const result = await new GenerateWeeklyReportController().generateWeeklyReport(parseSgDate("2026-10-28")!);

    expect(result).toEqual({
      ok: true,
      report: {
        from: monday,
        to: nextMonday,
        newUsers: 10,
        newProjects: 7,
        topCategories: [{ categoryId: 1, name: "Modern Kitchen", count: 40 }],
        topViewedProjects: [{ projectId: 3, title: "Loft", count: 12 }],
        topSavedProjects: [{ projectId: 4, title: "Attic", count: 5 }],
      },
    });
    expect(cats).toHaveBeenCalledWith(monday, nextMonday, 5);
  });

  it("rejects a week that starts in the future", async () => {
    expect(await new GenerateWeeklyReportController().generateWeeklyReport(parseSgDate("2026-11-09")!)).toEqual({
      ok: false,
      error: "Pick this week or an earlier week.",
    });
  });
});
