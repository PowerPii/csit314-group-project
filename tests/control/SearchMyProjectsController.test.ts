import { expect, it, vi } from "vitest";
import { SearchMyProjectsController } from "@/control/SearchMyProjectsController";
import { Project } from "@/entity/Project";
import { makeProject } from "../support/factories";

it("SearchMyProjectsController.searchMyProjects searches only the designer's projects (ID #10)", async () => {
  const found = [makeProject()];
  const search = vi.spyOn(Project, "searchByDesigner").mockResolvedValue(found);

  const result = await new SearchMyProjectsController().searchMyProjects(2, { title: " kitchen ", categoryId: 4, status: "current" });

  expect(result).toBe(found);
  expect(search).toHaveBeenCalledWith(2, { title: "kitchen", categoryId: 4, status: "current" });
});
