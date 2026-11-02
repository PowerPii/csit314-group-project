import { SearchPastProjectsController } from "@/control/SearchPastProjectsController";
import { ViewCategoriesController } from "@/control/ViewCategoriesController";
import { ViewPastProjectsController } from "@/control/ViewPastProjectsController";
import type { Project } from "@/entity/Project";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { ui } from "../../../ui";
import { DESIGNER_NAV } from "../../nav";
import { ProjectRowActions } from "../ProjectRowActions";
import { ProjectTable } from "../ProjectTable";

const param = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");
const date = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T00:00:00Z`) : undefined);

// ViewPastProjectsBoundary (ID #12). With search fields filled in it is SearchPastProjectsBoundary (ID #13).
export default async function ViewPastProjectsBoundary({ searchParams }: PageProps<"/designer/projects/past">) {
  const session = await requireRole("Interior Designer");
  const designerId = session.userAccountId!;
  const sp = await searchParams;
  const title = param(sp.title);
  const categoryId = param(sp.categoryId);
  const from = param(sp.from);
  const to = param(sp.to);
  const searching = Boolean(title || categoryId || from || to);

  let projects: Project[] = [];
  let error: string | undefined;
  if (searching) {
    const result = await new SearchPastProjectsController().searchPastProjects(designerId, {
      title,
      categoryId: categoryId ? Number(categoryId) : null,
      completedFrom: date(from),
      completedTo: date(to),
    });
    if (result.ok) projects = result.projects;
    else error = result.error;
  } else {
    projects = await new ViewPastProjectsController().viewPastProjects(designerId);
  }
  const categories = await new ViewCategoriesController().viewCategories();

  return (
    <>
      <ActorHeader title="Past projects" name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6">
        <form className="mb-6 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Title
            <input name="title" defaultValue={title} className={ui.input} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Category
            <select name="categoryId" defaultValue={categoryId} className={ui.input}>
              <option value="">Any</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Completed from
            <input name="from" type="date" defaultValue={from} className={ui.input} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            to
            <input name="to" type="date" defaultValue={to} className={ui.input} />
          </label>
          <button type="submit" className={ui.button}>Search</button>
          {searching && <a href="/designer/projects/past" className={ui.link}>Clear</a>}
        </form>
        {error && <p role="alert" className={`${ui.error} mb-4`}>{error}</p>}
        {!error &&
          (projects.length === 0 ? (
            <p>{searching ? "No projects match." : "You have no completed projects yet."}</p>
          ) : (
            <ProjectTable projects={projects} showCompleted actions={(p) => <ProjectRowActions project={p} />} />
          ))}
      </main>
    </>
  );
}
