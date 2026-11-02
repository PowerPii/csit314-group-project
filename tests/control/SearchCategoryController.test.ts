import { expect, it, vi } from "vitest";
import { SearchCategoryController } from "@/control/SearchCategoryController";
import { Category } from "@/entity/Category";
import { makeCategory } from "../support/factories";

it("SearchCategoryController.searchCategories searches by trimmed keyword (PM #7)", async () => {
  const found = [makeCategory()];
  const search = vi.spyOn(Category, "searchByName").mockResolvedValue(found);

  expect(await new SearchCategoryController().searchCategories(" kitchen ")).toBe(found);
  expect(search).toHaveBeenCalledWith("kitchen");
});
