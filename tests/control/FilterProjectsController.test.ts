import { describe, expect, it, vi } from "vitest";
import { FilterProjectsController } from "@/control/FilterProjectsController";
import { Category } from "@/entity/Category";
import { CompanyProfile } from "@/entity/CompanyProfile";
import { Project } from "@/entity/Project";
import { makeCategory, makeProfile, makeProject } from "../support/factories";

describe("FilterProjectsController.filterProjects (Customer #5)", () => {
  it("filters by category, style, designer and budget", async () => {
    const found = [makeProject()];
    const filter = vi.spyOn(Project, "filterPublic").mockResolvedValue(found);
    const f = { categoryId: 4, style: "Modern", designerId: 2, maxBudget: 50000 };

    expect(await new FilterProjectsController().filterProjects(f)).toEqual({ ok: true, projects: found });
    expect(filter).toHaveBeenCalledWith(f);
  });

  it.each([[0], [-5], [Number.NaN]])("rejects a budget of %s", async (maxBudget) => {
    expect(await new FilterProjectsController().filterProjects({ maxBudget })).toEqual({
      ok: false,
      error: "Budget must be a positive number.",
    });
  });
});

describe("FilterProjectsController.getFilterOptions (Customer #5)", () => {
  const kitchen = makeCategory({ id: 1, name: "Condo Kitchen" });
  const bedroom = makeCategory({ id: 2, name: "HDB Bedroom" });
  const study = makeCategory({ id: 3, name: "Landed Study" });
  const alpha = makeProfile({ designerId: 7, companyName: "Alpha Interiors" });
  const beta = makeProfile({ designerId: 8, companyName: "Beta Interiors" });

  function stubData() {
    vi.spyOn(Category, "findAll").mockResolvedValue([kitchen, bedroom, study]);
    vi.spyOn(CompanyProfile, "findAll").mockResolvedValue([alpha, beta]);
    const projects = [
      makeProject({ id: 1, categoryId: 1, designerId: 7, styleTags: ["Modern", "Japandi"] }),
      makeProject({ id: 2, categoryId: 2, designerId: 7, styleTags: ["Rustic"] }),
      makeProject({ id: 3, categoryId: 1, designerId: 8, styleTags: ["Modern"] }),
    ];
    // Stands in for the database: applies the same filter rules as Project.filterPublic.
    return vi.spyOn(Project, "filterPublic").mockImplementation(async (f) =>
      projects.filter(
        (p) =>
          (!f.categoryId || p.categoryId === f.categoryId) &&
          (!f.style || p.styleTags.includes(f.style)) &&
          (!f.designerId || p.designerId === f.designerId) &&
          (!f.maxBudget || (p.priceMin ?? 0) <= f.maxBudget),
      ),
    );
  }

  it("with no filter, offers only categories, styles and designers that have projects", async () => {
    stubData();
    const options = await new FilterProjectsController().getFilterOptions();
    expect(options.categories).toEqual([kitchen, bedroom]);
    expect(options.styles).toEqual(["Japandi", "Modern", "Rustic"]);
    expect(options.designers).toEqual([alpha, beta]);
  });

  it("narrows each drop-down by the other filters already chosen", async () => {
    stubData();
    const options = await new FilterProjectsController().getFilterOptions({ designerId: 8 });
    expect(options.categories).toEqual([kitchen]);
    expect(options.styles).toEqual(["Modern"]);
    // A drop-down is not narrowed by its own choice, so the customer can still switch designer.
    expect(options.designers).toEqual([alpha, beta]);
  });

  it("keeps a chosen option in its list even when nothing matches the other filters", async () => {
    const filter = stubData();
    const options = await new FilterProjectsController().getFilterOptions({ categoryId: 3, style: "Modern" });
    expect(options.categories).toEqual([kitchen, study]);
    expect(options.styles).toEqual(["Modern"]);
    expect(filter).toHaveBeenCalledWith({ style: "Modern" });
    expect(filter).toHaveBeenCalledWith({ categoryId: 3 });
  });
});
