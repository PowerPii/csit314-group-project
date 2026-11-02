import { GenerateWeeklyReportController } from "@/control/GenerateWeeklyReportController";
import { parseSgDate, sgDateString } from "@/control/reportPeriods";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { ui } from "../../../ui";
import { MANAGER_NAV } from "../../nav";
import { PeriodForm, StatGrid, TopTable } from "../ReportParts";

// WeeklyReportBoundary (PM #9)
export default async function WeeklyReportBoundary({ searchParams }: PageProps<"/platform-manager/reports/weekly">) {
  const session = await requireRole("Platform Manager");
  const { weekStart } = await searchParams;
  const dateText = typeof weekStart === "string" ? weekStart : sgDateString(new Date());
  const day = parseSgDate(dateText);
  const result = day
    ? await new GenerateWeeklyReportController().generateWeeklyReport(day)
    : ({ ok: false, error: "Pick this week or an earlier week." } as const);
  const lastDay = result.ok ? sgDateString(new Date(result.report.to.getTime() - 1)) : "";

  return (
    <>
      <ActorHeader title="Weekly report" name={session.name} nav={MANAGER_NAV} />
      <main className="flex flex-col gap-6 p-6 sm:p-10">
        <PeriodForm>
          <label className="flex flex-col gap-1 text-sm">
            Any day in the week
            <input name="weekStart" type="date" defaultValue={dateText} className={ui.input} />
          </label>
        </PeriodForm>
        {!result.ok ? (
          <p role="alert" className={ui.error}>{result.error}</p>
        ) : (
          <>
            <h2 className="font-serif text-xl tracking-tight">
              Week of {sgDateString(result.report.from)} to {lastDay} (Monday to Sunday)
            </h2>
            <StatGrid
              stats={[
                { label: "New users", value: result.report.newUsers },
                { label: "New projects", value: result.report.newProjects },
              ]}
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <TopTable
                title="Most popular categories"
                unit="Views"
                rows={result.report.topCategories.map((c) => ({ key: c.categoryId, name: c.name, count: c.count }))}
              />
              <TopTable
                title="Most viewed projects"
                unit="Views"
                rows={result.report.topViewedProjects.map((p) => ({ key: p.projectId, name: p.title, count: p.count }))}
              />
              <TopTable
                title="Most shortlisted projects"
                unit="Saves"
                rows={result.report.topSavedProjects.map((p) => ({ key: p.projectId, name: p.title, count: p.count }))}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
}
