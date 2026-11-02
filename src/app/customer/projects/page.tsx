import Link from "next/link";
import { FilterProjectsController } from "@/control/FilterProjectsController";
import { SearchProjectsController } from "@/control/SearchProjectsController";
import type { Project } from "@/entity/Project";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../ActorHeader";
import { ui } from "../../ui";
import { CUSTOMER_NAV } from "../nav";
import { ProjectCard, ProjectGrid } from "../ProjectCard";

const STYLES = ["Modern", "Scandinavian", "Industrial", "Minimalist", "Japandi", "Contemporary", "Classic", "Rustic", "Tropical", "Luxury"];
const PAGE_SIZE = 40;
const param = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim() : "");

// Browse page. With ?q=... it is SearchProjectsBoundary (Customer #4);
// otherwise FilterProjectsBoundary (Customer #5), which with no filters lists every project.
export default async function BrowseProjectsBoundary({ searchParams }: PageProps<"/customer/projects">) {
  const session = await requireRole("Customer");
  const sp = await searchParams;
  const q = param(sp.q);
  const categoryId = param(sp.categoryId);
  const style = param(sp.style);
  const designerId = param(sp.designerId);
  const maxBudget = param(sp.maxBudget);
  const shown = Math.max(PAGE_SIZE, Number(param(sp.show)) || PAGE_SIZE);

  const filterController = new FilterProjectsController();
  const options = await filterController.getFilterOptions();
  let projects: Project[] = [];
  let error: string | undefined;
  if ("q" in sp) {
    const result = await new SearchProjectsController().searchProjects(q);
    if (result.ok) projects = result.projects;
    else error = result.error;
  } else {
    const result = await filterController.filterProjects({
      categoryId: categoryId ? Number(categoryId) : null,
      style: style || undefined,
      designerId: designerId ? Number(designerId) : null,
      maxBudget: maxBudget ? Number(maxBudget) : null,
    });
    if (result.ok) projects = result.projects;
    else error = result.error;
  }
  const filtering = Boolean(categoryId || style || designerId || maxBudget);
  const moreParams = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) if (typeof value === "string") moreParams.set(key, value);
  moreParams.set("show", String(shown + PAGE_SIZE));

  return (
    <>
      <ActorHeader title="Browse projects" name={session.name} nav={CUSTOMER_NAV} />
      <main className="flex flex-col gap-4 p-6 sm:p-10">
        <form className="flex flex-wrap items-center gap-2">
          <input name="q" defaultValue={q} placeholder="Search by keyword, e.g. kitchen" className={`${ui.input} w-80`} />
          <button type="submit" className={ui.button}>Search</button>
        </form>
        <form className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4">
          <label className="flex flex-col gap-1">
            Category
            <select name="categoryId" defaultValue={categoryId} className={ui.input}>
              <option value="">Any</option>
              {options.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Design style
            <select name="style" defaultValue={style} className={ui.input}>
              <option value="">Any</option>
              {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Designer
            <select name="designerId" defaultValue={designerId} className={`${ui.input} max-w-60`}>
              <option value="">Any</option>
              {options.designers.map((d) => <option key={d.designerId} value={d.designerId}>{d.companyName}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Budget up to (SGD)
            <input name="maxBudget" type="number" step={1} defaultValue={maxBudget} className={`${ui.input} w-36`} />
          </label>
          <button type="submit" className={ui.button}>Filter</button>
          {(filtering || "q" in sp) && <Link href="/customer/projects" className={ui.link}>Clear</Link>}
        </form>

        {error ? (
          <p role="alert" className={ui.error}>{error}</p>
        ) : projects.length === 0 ? (
          <p>{"q" in sp ? "No projects match." : "No projects match these filters."}</p>
        ) : (
          <>
            <p className="text-sm">
              {projects.length} project(s){"q" in sp ? ` match "${q}"` : filtering ? " match these filters" : ""}.
            </p>
            <ProjectGrid>
              {projects.slice(0, shown).map((p) => <ProjectCard key={p.id} project={p} />)}
            </ProjectGrid>
            {projects.length > shown && <Link href={`?${moreParams}`} className={`${ui.button} self-center`}>Show more</Link>}
          </>
        )}
      </main>
    </>
  );
}
