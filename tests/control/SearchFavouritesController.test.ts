import { expect, it, vi } from "vitest";
import { SearchFavouritesController } from "@/control/SearchFavouritesController";
import { Favourite } from "@/entity/Favourite";
import { makeProject } from "../support/factories";

it("SearchFavouritesController.searchFavourites searches saved projects by title and category (Customer #10)", async () => {
  const found = [makeProject()];
  const search = vi.spyOn(Favourite, "searchProjectsByCustomer").mockResolvedValue(found);

  expect(await new SearchFavouritesController().searchFavourites(30, " kitchen ", 4)).toBe(found);
  expect(search).toHaveBeenCalledWith(30, "kitchen", 4);
});
