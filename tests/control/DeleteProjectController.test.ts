import { describe, expect, it, vi } from "vitest";
import { DeleteProjectController } from "@/control/DeleteProjectController";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

describe("DeleteProjectController.deleteProject (ID #9)", () => {
  it("deletes the designer's own project", async () => {
    const project = makeProject({ designerId: 2 });
    vi.spyOn(Project, "findById").mockResolvedValue(project);
    const del = vi.spyOn(project, "delete").mockResolvedValue();

    expect(await new DeleteProjectController().deleteProject(2, 11)).toEqual({ ok: true });
    expect(del).toHaveBeenCalled();
  });

  it.each([[null], [makeProject({ designerId: 99 })]])("refuses missing projects and other designers' projects", async (found) => {
    vi.spyOn(Project, "findById").mockResolvedValue(found);

    expect(await new DeleteProjectController().deleteProject(2, 11)).toEqual({ ok: false, error: "Project not found." });
  });
});
