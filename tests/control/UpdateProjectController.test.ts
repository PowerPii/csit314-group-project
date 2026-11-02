import { describe, expect, it, vi } from "vitest";
import { UpdateProjectController } from "@/control/UpdateProjectController";
import { Project, type ProjectDetails } from "@/entity/Project";
import { makeFile, makeProject } from "../support/factories";

const details = (overrides: Partial<ProjectDetails> = {}): ProjectDetails => ({
  title: "Kitchen at Orchard",
  description: "Open kitchen",
  categoryId: 4,
  styleTags: ["Modern"],
  priceMin: 20000,
  priceMax: 30000,
  imageUrls: ["https://cdn/kept.png"],
  ...overrides,
});
const update = (d = details(), newImages: File[] = [], projectId = 11) =>
  new UpdateProjectController().updateProject(2, projectId, d, newImages);

describe("UpdateProjectController.updateProject (ID #8)", () => {
  it("saves the details and adds new images after the kept ones", async () => {
    const project = makeProject({ designerId: 2 });
    vi.spyOn(Project, "findById").mockResolvedValue(project);
    vi.spyOn(Project, "uploadImages").mockResolvedValue(["https://cdn/new.png"]);
    const save = vi.spyOn(project, "update").mockResolvedValue();

    const result = await update(details({ title: " New title " }), [makeFile()]);

    expect(save).toHaveBeenCalledWith(
      details({ title: "New title", imageUrls: ["https://cdn/kept.png", "https://cdn/new.png"] }),
    );
    expect(result).toEqual({ ok: true, project });
  });

  it("does not upload anything when no new images are chosen", async () => {
    const project = makeProject({ designerId: 2 });
    vi.spyOn(Project, "findById").mockResolvedValue(project);
    vi.spyOn(project, "update").mockResolvedValue();
    const upload = vi.spyOn(Project, "uploadImages");

    await update();

    expect(upload).not.toHaveBeenCalled();
  });

  it("requires a title", async () => {
    expect(await update(details({ title: "" }))).toEqual({ ok: false, error: "Title is required." });
  });

  it("rejects a bad price range", async () => {
    expect(await update(details({ priceMin: 5, priceMax: 1 }))).toEqual({ ok: false, error: "Enter a valid price range." });
  });

  it("keeps the gallery to 10 images", async () => {
    const kept = Array.from({ length: 9 }, (_, i) => `https://cdn/${i}.png`);
    expect(await update(details({ imageUrls: kept }), [makeFile(), makeFile()])).toEqual({
      ok: false,
      error: "Up to 10 PNG or JPG images, 5 MB each.",
    });
  });

  it.each([[null], [makeProject({ designerId: 99 })]])("hides missing projects and other designers' projects", async (found) => {
    vi.spyOn(Project, "findById").mockResolvedValue(found);

    expect(await update()).toEqual({ ok: false, error: "Project not found." });
  });
});
