import { GenerateMonthlyReportController } from "@/control/GenerateMonthlyReportController";
import { sgDateString } from "@/control/reportPeriods";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { ui } from "../../../ui";
import { MANAGER_NAV } from "../../nav";
import { PeriodForm, StatGrid } from "../ReportParts";

// MonthlyReportBoundary (PM #10)
export default async function MonthlyReportBoundary({ searchParams }: PageProps<"/platform-manager/reports/monthly">) {
  const session = await requireRole("Platform Manager");
  const { month } = await searchParams;
  const monthText = typeof month === "string" ? month : sgDateString(new Date()).slice(0, 7);
  const result = await new GenerateMonthlyReportController().generateMonthlyReport(monthText);

  return (
    <>
      <ActorHeader title="Monthly report" name={session.name} nav={MANAGER_NAV} />
      <main className="flex flex-col gap-6 p-6 sm:p-10">
        <PeriodForm>
          <label className="flex flex-col gap-1 text-sm">
            Month
            <input name="month" type="month" defaultValue={monthText} placeholder="YYYY-MM" className={ui.input} />
          </label>
        </PeriodForm>
        {!result.ok ? (
          <p role="alert" className={ui.error}>{result.error}</p>
        ) : (
          <>
            <h2 className="font-serif text-xl tracking-tight">{monthText} (Singapore time)</h2>
            <StatGrid
              stats={[
                { label: "New customer registrations", value: result.report.current.newCustomers, previous: result.report.previous.newCustomers },
                { label: "New projects", value: result.report.current.newProjects, previous: result.report.previous.newProjects },
                { label: "Project views", value: result.report.current.views, previous: result.report.previous.views },
                { label: "Shortlists (saves)", value: result.report.current.shortlists, previous: result.report.previous.shortlists },
              ]}
            />
          </>
        )}
      </main>
    </>
  );
}
