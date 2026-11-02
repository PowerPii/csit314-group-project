import { describe, expect, it, vi } from "vitest";
import { FilterProjectsController } from "@/control/FilterProjectsController";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

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
