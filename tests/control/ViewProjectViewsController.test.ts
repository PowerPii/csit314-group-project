import { expect, it, vi } from "vitest";
import { ViewProjectViewsController } from "@/control/ViewProjectViewsController";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { makeProject } from "../support/factories";

it("ViewProjectViewsController.viewProjectViews gives each project its views, most viewed first (ID #14)", async () => {
  const a = makeProject({ id: 1 });
  const b = makeProject({ id: 2 });
  const c = makeProject({ id: 3 });
  vi.spyOn(Project, "findByDesigner").mockResolvedValue([a, b, c]);
  const count = vi.spyOn(ProjectView, "countByProjects").mockResolvedValue(new Map([[1, 4], [2, 9]]));

  expect(await new ViewProjectViewsController().viewProjectViews(2)).toEqual([
    { project: b, count: 9 },
    { project: a, count: 4 },
    { project: c, count: 0 },
  ]);
  expect(count).toHaveBeenCalledWith([1, 2, 3]);
});
