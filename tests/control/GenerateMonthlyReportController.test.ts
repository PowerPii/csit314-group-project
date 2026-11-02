import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GenerateMonthlyReportController } from "@/control/GenerateMonthlyReportController";
import { parseSgDate } from "@/control/reportPeriods";
import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { UserAccount } from "@/entity/UserAccount";

describe("GenerateMonthlyReportController.generateMonthlyReport (PM #10)", () => {
  beforeEach(() => vi.useFakeTimers({ now: new Date("2026-11-02T04:00:00Z"), toFake: ["Date"] }));
  afterEach(() => vi.useRealTimers());

  it("reports the month's totals next to the month before", async () => {
    const oct = parseSgDate("2026-10-01")!;
    const sep = parseSgDate("2026-09-01")!;
    const nov = parseSgDate("2026-11-01")!;
    const customers = vi
      .spyOn(UserAccount, "countCreatedBetween")
      .mockImplementation(async (from) => (from.getTime() === oct.getTime() ? 30 : 20));
    vi.spyOn(Project, "countCreatedBetween").mockImplementation(async (from) => (from.getTime() === oct.getTime() ? 100 : 90));
    vi.spyOn(ProjectView, "countBetween").mockImplementation(async (from) => (from.getTime() === oct.getTime() ? 1000 : 900));
    vi.spyOn(Favourite, "countBetween").mockImplementation(async (from) => (from.getTime() === oct.getTime() ? 160 : 170));

    expect(await new GenerateMonthlyReportController().generateMonthlyReport("2026-10")).toEqual({
      ok: true,
      report: {
        month: "2026-10",
        from: oct,
        to: nov,
        current: { newCustomers: 30, newProjects: 100, views: 1000, shortlists: 160 },
        previous: { newCustomers: 20, newProjects: 90, views: 900, shortlists: 170 },
      },
    });
    expect(customers).toHaveBeenCalledWith(oct, nov, "Customer");
    expect(customers).toHaveBeenCalledWith(sep, oct, "Customer");
  });

  it("allows the current month", async () => {
    vi.spyOn(UserAccount, "countCreatedBetween").mockResolvedValue(0);
    vi.spyOn(Project, "countCreatedBetween").mockResolvedValue(0);
    vi.spyOn(ProjectView, "countBetween").mockResolvedValue(0);
    vi.spyOn(Favourite, "countBetween").mockResolvedValue(0);

    expect((await new GenerateMonthlyReportController().generateMonthlyReport("2026-11")).ok).toBe(true);
  });

  it.each(["2026-12", "2026-13", "October"])("rejects %s", async (month) => {
    expect(await new GenerateMonthlyReportController().generateMonthlyReport(month)).toEqual({
      ok: false,
      error: "Pick this month or an earlier month.",
    });
  });
});
