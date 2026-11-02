import { describe, expect, it, vi } from "vitest";
import { SearchProjectsController } from "@/control/SearchProjectsController";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

describe("SearchProjectsController.searchProjects (Customer #4)", () => {
  it("searches all projects by trimmed keyword", async () => {
    const found = [makeProject()];
    const search = vi.spyOn(Project, "searchPublic").mockResolvedValue(found);

    expect(await new SearchProjectsController().searchProjects("  kitchen ")).toEqual({ ok: true, projects: found });
    expect(search).toHaveBeenCalledWith("kitchen");
  });

  it("needs at least 2 characters", async () => {
    const search = vi.spyOn(Project, "searchPublic");

    expect(await new SearchProjectsController().searchProjects(" k ")).toEqual({
      ok: false,
      error: "Enter at least 2 characters.",
    });
    expect(search).not.toHaveBeenCalled();
  });
});
