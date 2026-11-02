import { ViewShortlistCountsController } from "@/control/ViewShortlistCountsController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { DESIGNER_NAV } from "../../nav";
import { CountTable } from "../CountTable";

// ShortlistCountsBoundary (ID #15): how many customers saved each project, most saved first.
export default async function ShortlistCountsBoundary() {
  const session = await requireRole("Interior Designer");
  const rows = await new ViewShortlistCountsController().viewShortlistCounts(session.userAccountId!);

  return (
    <>
      <ActorHeader title="Shortlist counts" name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6">
        {rows.length === 0 ? <p>You have no projects yet.</p> : <CountTable rows={rows} label="Saves" />}
      </main>
    </>
  );
}
