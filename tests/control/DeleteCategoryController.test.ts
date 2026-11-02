import { describe, expect, it, vi } from "vitest";
import { DeleteCategoryController } from "@/control/DeleteCategoryController";
import { Category } from "@/entity/Category";
import { Project } from "@/entity/Project";
import { makeCategory } from "../support/factories";

const del = (id: number, reassignToId: number | null) => new DeleteCategoryController().deleteCategory(id, reassignToId);

function stubCategories(count: number) {
  const doomed = makeCategory({ id: 4 });
  vi.spyOn(Category, "findById").mockImplementation(async (id) =>
    id === 4 ? doomed : id === 5 ? makeCategory({ id: 5, name: "Rustic Kitchen" }) : null,
  );
  vi.spyOn(Project, "countByCategory").mockResolvedValue(count);
  const remove = vi.spyOn(doomed, "delete").mockResolvedValue();
  return { remove };
}

describe("DeleteCategoryController.deleteCategory (PM #6)", () => {
  it("deletes an empty category without moving anything", async () => {
    const { remove } = stubCategories(0);
    const move = vi.spyOn(Project, "reassignCategory");

    expect(await del(4, null)).toEqual({ ok: true, moved: 0 });
    expect(move).not.toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
  });

  it("moves the projects to another category first", async () => {
    const { remove } = stubCategories(3);
    const move = vi.spyOn(Project, "reassignCategory").mockResolvedValue(3);

    expect(await del(4, 5)).toEqual({ ok: true, moved: 3 });
    expect(move).toHaveBeenCalledWith(4, 5);
    expect(move.mock.invocationCallOrder[0]).toBeLessThan(remove.mock.invocationCallOrder[0]);
  });

  it("refuses to move projects into the category being deleted", async () => {
    expect(await del(4, 4)).toEqual({ ok: false, error: "Choose a different category to move the projects to." });
  });

  it("reports a missing category", async () => {
    stubCategories(0);

    expect(await del(404, null)).toEqual({ ok: false, error: "Category not found." });
  });

  it.each([[null], [999]])("needs a real category to move projects to (reassignToId=%s)", async (reassignToId) => {
    const { remove } = stubCategories(3);

    expect(await del(4, reassignToId)).toEqual({ ok: false, error: "Choose a category to move its 3 projects to." });
    expect(remove).not.toHaveBeenCalled();
  });
});
