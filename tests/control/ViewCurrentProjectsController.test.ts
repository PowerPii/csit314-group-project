import { expect, it, vi } from "vitest";
import { ViewCurrentProjectsController } from "@/control/ViewCurrentProjectsController";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

it("ViewCurrentProjectsController.viewCurrentProjects lists the designer's current projects (ID #7)", async () => {
  const projects = [makeProject()];
  const find = vi.spyOn(Project, "findByDesigner").mockResolvedValue(projects);

  expect(await new ViewCurrentProjectsController().viewCurrentProjects(2)).toBe(projects);
  expect(find).toHaveBeenCalledWith(2, "current");
});
