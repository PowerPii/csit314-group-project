import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GenerateDailyReportController } from "@/control/GenerateDailyReportController";
import { parseSgDate } from "@/control/reportPeriods";
import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { UserAccount } from "@/entity/UserAccount";
import { makeProject } from "../support/factories";

describe("GenerateDailyReportController.generateDailyReport (PM #8)", () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date("2026-11-02T04:00:00Z"), toFake: ["Date"] }));
  afterEach(() => vi.useRealTimers());

  it("counts the day's activity and lists projects with no views", async () => {
    const day = parseSgDate("2026-11-01")!;
    const next = parseSgDate("2026-11-02")!;
    const users = vi.spyOn(UserAccount, "countCreatedBetween").mockResolvedValue(4);
    vi.spyOn(Project, "countCreatedBetween").mockResolvedValue(2);
    vi.spyOn(ProjectView, "countBetween").mockResolvedValue(35);
    vi.spyOn(Favourite, "countBetween").mockResolvedValue(6);
    const quiet = [makeProject()];
    vi.spyOn(Project, "findWithNoViewsBetween").mockResolvedValue(quiet);

    expect(await new GenerateDailyReportController().generateDailyReport(day)).toEqual({
      ok: true,
      report: { from: day, to: next, newUsers: 4, newProjects: 2, views: 35, shortlists: 6, projectsWithNoViews: quiet },
    });
    expect(users).toHaveBeenCalledWith(day, next);
  });

  it("allows today", async () => {
    vi.spyOn(Project, "countCreatedBetween").mockResolvedValue(0);
    vi.spyOn(Project, "findWithNoViewsBetween").mockResolvedValue([]);
    vi.spyOn(UserAccount, "countCreatedBetween").mockResolvedValue(0);
    vi.spyOn(ProjectView, "countBetween").mockResolvedValue(0);
    vi.spyOn(Favourite, "countBetween").mockResolvedValue(0);

    expect((await new GenerateDailyReportController().generateDailyReport(parseSgDate("2026-11-02")!)).ok).toBe(true);
  });

  it("rejects a future date", async () => {
    expect(await new GenerateDailyReportController().generateDailyReport(parseSgDate("2026-11-03")!)).toEqual({
      ok: false,
      error: "Pick today or an earlier date.",
    });
  });
});
