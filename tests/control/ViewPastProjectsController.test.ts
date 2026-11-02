import { expect, it, vi } from "vitest";
import { ViewPastProjectsController } from "@/control/ViewPastProjectsController";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

it("ViewPastProjectsController.viewPastProjects lists the designer's completed projects (ID #12)", async () => {
  const projects = [makeProject({ status: "completed" })];
  const find = vi.spyOn(Project, "findByDesigner").mockResolvedValue(projects);

  expect(await new ViewPastProjectsController().viewPastProjects(2)).toBe(projects);
  expect(find).toHaveBeenCalledWith(2, "completed");
});
