import { describe, expect, it, vi } from "vitest";
import { SearchPastProjectsController } from "@/control/SearchPastProjectsController";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

describe("SearchPastProjectsController.searchPastProjects (ID #13)", () => {
  it("searches completed projects only, including the whole 'to' day", async () => {
    const found = [makeProject({ status: "completed" })];
    const search = vi.spyOn(Project, "searchByDesigner").mockResolvedValue(found);

    const result = await new SearchPastProjectsController().searchPastProjects(2, {
      title: " kitchen ",
      completedFrom: new Date("2026-10-01T00:00:00Z"),
      completedTo: new Date("2026-10-31T00:00:00Z"),
    });

    expect(result).toEqual({ ok: true, projects: found });
    expect(search).toHaveBeenCalledWith(2, {
      title: "kitchen",
      status: "completed",
      completedFrom: new Date("2026-10-01T00:00:00Z"),
      completedTo: new Date("2026-11-01T00:00:00Z"),
    });
  });

  it("rejects a start date after the end date", async () => {
    const search = vi.spyOn(Project, "searchByDesigner");

    const result = await new SearchPastProjectsController().searchPastProjects(2, {
      completedFrom: new Date("2026-10-31"),
      completedTo: new Date("2026-10-01"),
    });

    expect(result).toEqual({ ok: false, error: "The start date must be before the end date." });
    expect(search).not.toHaveBeenCalled();
  });
});
