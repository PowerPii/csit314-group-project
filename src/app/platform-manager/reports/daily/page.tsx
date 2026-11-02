import { GenerateDailyReportController } from "@/control/GenerateDailyReportController";
import { parseSgDate, sgDateString } from "@/control/reportPeriods";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { ui } from "../../../ui";
import { MANAGER_NAV } from "../../nav";
import { PeriodForm, StatGrid } from "../ReportParts";

// DailyReportBoundary (PM #8)
export default async function DailyReportBoundary({ searchParams }: PageProps<"/platform-manager/reports/daily">) {
  const session = await requireRole("Platform Manager");
  const { date } = await searchParams;
  const dateText = typeof date === "string" ? date : sgDateString(new Date());
  const day = parseSgDate(dateText);
  const result = day
    ? await new GenerateDailyReportController().generateDailyReport(day)
    : ({ ok: false, error: "Pick today or an earlier date." } as const);

  return (
    <>
      <ActorHeader title="Daily report" name={session.name} nav={MANAGER_NAV} />
      <main className="flex flex-col gap-6 p-6 sm:p-10">
        <PeriodForm>
          <label className="flex flex-col gap-1 text-sm">
            Date
            <input name="date" type="date" defaultValue={dateText} className={ui.input} />
          </label>
        </PeriodForm>
        {!result.ok ? (
          <p role="alert" className={ui.error}>{result.error}</p>
        ) : (
          <>
            <h2 className="font-serif text-xl tracking-tight">Activity on {dateText} (Singapore time)</h2>
            <StatGrid
              stats={[
                { label: "New users", value: result.report.newUsers },
                { label: "New projects", value: result.report.newProjects },
                { label: "Project views", value: result.report.views },
                { label: "Shortlists (saves)", value: result.report.shortlists },
              ]}
            />
            <section>
              <h2 className="mb-3 font-serif text-xl tracking-tight">Projects with no views ({result.report.projectsWithNoViews.length})</h2>
              <ul className="columns-1 text-sm sm:columns-2 lg:columns-3">
                {result.report.projectsWithNoViews.map((p) => <li key={p.id}>{p.title}</li>)}
              </ul>
            </section>
          </>
        )}
      </main>
    </>
  );
}
