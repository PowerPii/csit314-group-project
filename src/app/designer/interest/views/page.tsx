import { ViewProjectViewsController } from "@/control/ViewProjectViewsController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { DESIGNER_NAV } from "../../nav";
import { CountTable } from "../CountTable";

// ProjectViewsBoundary (ID #14): total views per project, most viewed first.
export default async function ProjectViewsBoundary() {
  const session = await requireRole("Interior Designer");
  const rows = await new ViewProjectViewsController().viewProjectViews(session.userAccountId!);

  return (
    <>
      <ActorHeader title="Project views" name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6 sm:p-10">
        {rows.length === 0 ? <p>You have no projects yet.</p> : <CountTable rows={rows} label="Views" />}
      </main>
    </>
  );
}
