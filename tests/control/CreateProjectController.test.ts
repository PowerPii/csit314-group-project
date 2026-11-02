import { describe, expect, it, vi } from "vitest";
import { CreateProjectController } from "@/control/CreateProjectController";
import { Category } from "@/entity/Category";
import { Project, type ProjectDetails } from "@/entity/Project";
import { makeCategory, makeFile, makeProject } from "../support/factories";

const details = (overrides: Partial<ProjectDetails> = {}): ProjectDetails => ({
  title: "Kitchen at Orchard",
  description: "Open kitchen",
  categoryId: 4,
  styleTags: ["Modern"],
  priceMin: 20000,
  priceMax: 30000,
  imageUrls: [],
  ...overrides,
});
const create = (d = details(), images: File[] = []) => new CreateProjectController().createProject(2, d, images);

describe("CreateProjectController.createProject (ID #6)", () => {
  it("uploads the images and creates the project", async () => {
    vi.spyOn(Category, "findById").mockResolvedValue(makeCategory());
    const upload = vi.spyOn(Project, "uploadImages").mockResolvedValue(["https://cdn/a.png"]);
    const saved = makeProject();
    const insert = vi.spyOn(Project, "create").mockResolvedValue(saved);
    const images = [makeFile()];

    const result = await create(details({ title: " Kitchen at Orchard ", styleTags: [" Modern ", "", "Japandi"] }), images);

    expect(upload).toHaveBeenCalledWith(2, images);
    expect(insert).toHaveBeenCalledWith(
      2,
      details({ styleTags: ["Modern", "Japandi"], imageUrls: ["https://cdn/a.png"] }),
    );
    expect(result).toEqual({ ok: true, project: saved });
  });

  it("requires a title", async () => {
    expect(await create(details({ title: " " }))).toEqual({ ok: false, error: "Title is required." });
  });

  it.each([
    [details({ priceMin: 40000, priceMax: 30000 })],
    [details({ priceMin: -1 })],
  ])("rejects a bad price range", async (d) => {
    expect(await create(d)).toEqual({ ok: false, error: "Enter a valid price range." });
  });

  it.each([
    ["11 images", Array.from({ length: 11 }, () => makeFile())],
    ["a GIF", [makeFile("image/gif", 10, "a.gif")]],
    ["an image over 5 MB", [makeFile("image/jpeg", 5 * 1024 * 1024 + 1, "big.jpg")]],
  ])("rejects %s", async (_label, images) => {
    expect(await create(details(), images)).toEqual({ ok: false, error: "Up to 10 PNG or JPG images, 5 MB each." });
  });

  it.each([[null], [makeCategory({ isSuspended: true })]])("rejects a missing or suspended category", async (category) => {
    vi.spyOn(Category, "findById").mockResolvedValue(category);
    const insert = vi.spyOn(Project, "create");

    expect(await create()).toEqual({ ok: false, error: "Choose a category." });
    expect(insert).not.toHaveBeenCalled();
  });
});
