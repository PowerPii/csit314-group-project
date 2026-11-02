import { describe, expect, it, vi } from "vitest";
import { ViewProjectController } from "@/control/ViewProjectController";
import { CompanyProfile } from "@/entity/CompanyProfile";
import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import { ProjectView } from "@/entity/ProjectView";
import { makeProfile, makeProject } from "../support/factories";

describe("ViewProjectController.viewProject (Customer #6)", () => {
  it("returns the project, its designer's profile and whether it is saved, and records the view", async () => {
    const project = makeProject({ id: 11, designerId: 2 });
    const company = makeProfile();
    vi.spyOn(Project, "findById").mockResolvedValue(project);
    vi.spyOn(CompanyProfile, "findByDesignerId").mockResolvedValue(company);
    const record = vi.spyOn(ProjectView, "record").mockResolvedValue();
    vi.spyOn(Favourite, "exists").mockResolvedValue(true);

    expect(await new ViewProjectController().viewProject(11, 30)).toEqual({ ok: true, project, company, isSaved: true });
    expect(record).toHaveBeenCalledWith(11, 30);
  });

  it("reports a missing project without recording a view", async () => {
    vi.spyOn(Project, "findById").mockResolvedValue(null);
    const record = vi.spyOn(ProjectView, "record");

    expect(await new ViewProjectController().viewProject(404, 30)).toEqual({ ok: false, error: "Project not found." });
    expect(record).not.toHaveBeenCalled();
  });
});
