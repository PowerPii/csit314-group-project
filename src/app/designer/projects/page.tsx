import Link from "next/link";
import { ViewCurrentProjectsController } from "@/control/ViewCurrentProjectsController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../ActorHeader";
import { ui } from "../../ui";
import { DESIGNER_NAV } from "../nav";
import { ProjectRowActions } from "./ProjectRowActions";
import { ProjectTable } from "./ProjectTable";

// ViewCurrentProjectsBoundary (ID #7)
export default async function ViewCurrentProjectsBoundary() {
  const session = await requireRole("Interior Designer");
  const projects = await new ViewCurrentProjectsController().viewCurrentProjects(session.userAccountId!);

  return (
    <>
      <ActorHeader title="Current projects" name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <Link href="/designer/projects/new" className={ui.button}>New project</Link>
          <span className="text-sm">{projects.length} current project(s)</span>
        </div>
        {projects.length === 0 ? (
          <p>You have no current projects.</p>
        ) : (
          <ProjectTable projects={projects} actions={(p) => <ProjectRowActions project={p} />} />
        )}
      </main>
    </>
  );
}
