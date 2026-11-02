import { describe, expect, it, vi } from "vitest";
import { MarkProjectCompletedController } from "@/control/MarkProjectCompletedController";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

const mark = () => new MarkProjectCompletedController().markProjectCompleted(2, 11);

describe("MarkProjectCompletedController.markProjectCompleted (ID #11)", () => {
  it("marks a current project completed", async () => {
    const project = makeProject({ designerId: 2 });
    vi.spyOn(Project, "findById").mockResolvedValue(project);
    const complete = vi.spyOn(project, "markCompleted").mockResolvedValue();

    expect(await mark()).toEqual({ ok: true });
    expect(complete).toHaveBeenCalled();
  });

  it.each([[null], [makeProject({ designerId: 99 })]])("refuses missing projects and other designers' projects", async (found) => {
    vi.spyOn(Project, "findById").mockResolvedValue(found);

    expect(await mark()).toEqual({ ok: false, error: "Project not found." });
  });

  it("rejects a project that is already completed", async () => {
    vi.spyOn(Project, "findById").mockResolvedValue(makeProject({ designerId: 2, status: "completed" }));

    expect(await mark()).toEqual({ ok: false, error: "This project is already completed." });
  });
});
