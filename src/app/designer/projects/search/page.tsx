import { SearchMyProjectsController } from "@/control/SearchMyProjectsController";
import { ViewCategoriesController } from "@/control/ViewCategoriesController";
import type { ProjectStatus } from "@/entity/Project";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { ui } from "../../../ui";
import { DESIGNER_NAV } from "../../nav";
import { ProjectRowActions } from "../ProjectRowActions";
import { ProjectTable } from "../ProjectTable";

const param = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

// SearchMyProjectsBoundary (ID #10): search my portfolio by title, category or status.
export default async function SearchMyProjectsBoundary({ searchParams }: PageProps<"/designer/projects/search">) {
  const session = await requireRole("Interior Designer");
  const sp = await searchParams;
  const title = param(sp.title);
  const categoryId = param(sp.categoryId);
  const status = param(sp.status);
  const searched = "title" in sp || "categoryId" in sp || "status" in sp;

  const [categories, projects] = await Promise.all([
    new ViewCategoriesController().viewCategories(),
    searched
      ? new SearchMyProjectsController().searchMyProjects(session.userAccountId!, {
          title,
          categoryId: categoryId ? Number(categoryId) : null,
          status: status === "current" || status === "completed" ? (status as ProjectStatus) : undefined,
        })
      : Promise.resolve(null),
  ]);

  return (
    <>
      <ActorHeader title="Search my projects" name={session.name} nav={DESIGNER_NAV} />
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
            Status
            <select name="status" defaultValue={status} className={ui.input}>
              <option value="">Any</option>
              <option value="current">Current</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <button type="submit" className={ui.button}>Search</button>
        </form>
        {projects &&
          (projects.length === 0 ? (
            <p>No projects match.</p>
          ) : (
            <ProjectTable
              projects={projects}
              extraColumn={{ label: "Status", value: (p) => (p.status === "current" ? "Current" : "Completed") }}
              actions={(p) => <ProjectRowActions project={p} />}
            />
          ))}
      </main>
    </>
  );
}
