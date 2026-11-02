import { describe, expect, it, vi } from "vitest";
import { CreateCategoryController } from "@/control/CreateCategoryController";
import { Category } from "@/entity/Category";
import { makeCategory } from "../support/factories";

const create = (name: string, description = "") => new CreateCategoryController().createCategory(name, description);

describe("CreateCategoryController.createCategory (PM #3)", () => {
  it("creates a category with a trimmed name and description", async () => {
    vi.spyOn(Category, "findByName").mockResolvedValue(null);
    const saved = makeCategory({ name: "Bohemian Loft" });
    const insert = vi.spyOn(Category, "create").mockResolvedValue(saved);

    expect(await create(" Bohemian Loft ", " Free-spirited lofts ")).toEqual({ ok: true, category: saved });
    expect(insert).toHaveBeenCalledWith("Bohemian Loft", "Free-spirited lofts");
  });

  it("requires a name", async () => {
    expect(await create("  ")).toEqual({ ok: false, error: "Category name is required." });
  });

  it("limits the name to 50 characters", async () => {
    expect(await create("x".repeat(51))).toEqual({ ok: false, error: "Category name must be 50 characters or fewer." });
  });

  it("rejects a duplicate name", async () => {
    vi.spyOn(Category, "findByName").mockResolvedValue(makeCategory({ name: "Modern Kitchen" }));
    const insert = vi.spyOn(Category, "create");

    expect(await create("modern kitchen")).toEqual({ ok: false, error: 'A category named "modern kitchen" already exists.' });
    expect(insert).not.toHaveBeenCalled();
  });
});
