import { expect, it, vi } from "vitest";
import { ViewCategoriesController } from "@/control/ViewCategoriesController";
import { Category } from "@/entity/Category";
import { makeCategory } from "../support/factories";

it("ViewCategoriesController.viewCategories returns every category (PM #4)", async () => {
  const categories = [makeCategory({ id: 1 }), makeCategory({ id: 2 })];
  vi.spyOn(Category, "findAll").mockResolvedValue(categories);

  expect(await new ViewCategoriesController().viewCategories()).toEqual(categories);
});
