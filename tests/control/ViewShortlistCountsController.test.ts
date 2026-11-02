import { expect, it, vi } from "vitest";
import { ViewShortlistCountsController } from "@/control/ViewShortlistCountsController";
import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

it("ViewShortlistCountsController.viewShortlistCounts gives each project its saves, most saved first (ID #15)", async () => {
  const a = makeProject({ id: 1 });
  const b = makeProject({ id: 2 });
  vi.spyOn(Project, "findByDesigner").mockResolvedValue([a, b]);
  vi.spyOn(Favourite, "countByProjects").mockResolvedValue(new Map([[2, 3]]));

  expect(await new ViewShortlistCountsController().viewShortlistCounts(2)).toEqual([
    { project: b, count: 3 },
    { project: a, count: 0 },
  ]);
});
