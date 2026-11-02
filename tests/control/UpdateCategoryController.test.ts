import { describe, expect, it, vi } from "vitest";
import { UpdateCategoryController } from "@/control/UpdateCategoryController";
import { Category } from "@/entity/Category";
import { makeCategory } from "../support/factories";

const update = (id: number, name: string, description = "") =>
  new UpdateCategoryController().updateCategory(id, name, description);

describe("UpdateCategoryController.updateCategory (PM #5)", () => {
  it("updates the name and description", async () => {
    const category = makeCategory({ id: 4 });
    vi.spyOn(Category, "findById").mockResolvedValue(category);
    vi.spyOn(Category, "findByName").mockResolvedValue(null);
    const save = vi.spyOn(category, "update").mockResolvedValue();

    expect(await update(4, " Modern Kitchens ", " Sleek ")).toEqual({ ok: true, category });
    expect(save).toHaveBeenCalledWith("Modern Kitchens", "Sleek");
  });

  it("allows keeping the same name", async () => {
    const category = makeCategory({ id: 4 });
    vi.spyOn(Category, "findById").mockResolvedValue(category);
    vi.spyOn(Category, "findByName").mockResolvedValue(category);
    vi.spyOn(category, "update").mockResolvedValue();

    expect(await update(4, "Modern Kitchen", "New text")).toEqual({ ok: true, category });
  });

  it("validates the name", async () => {
    expect(await update(4, "")).toEqual({ ok: false, error: "Category name is required." });
    expect(await update(4, "y".repeat(51))).toEqual({ ok: false, error: "Category name must be 50 characters or fewer." });
  });

  it("reports a missing category", async () => {
    vi.spyOn(Category, "findById").mockResolvedValue(null);
    vi.spyOn(Category, "findByName").mockResolvedValue(null);

    expect(await update(404, "Anything")).toEqual({ ok: false, error: "Category not found." });
  });

  it("rejects a name used by another category", async () => {
    vi.spyOn(Category, "findById").mockResolvedValue(makeCategory({ id: 4 }));
    vi.spyOn(Category, "findByName").mockResolvedValue(makeCategory({ id: 5, name: "Rustic Kitchen" }));

    expect(await update(4, "Rustic Kitchen")).toEqual({ ok: false, error: 'A category named "Rustic Kitchen" already exists.' });
  });
});
