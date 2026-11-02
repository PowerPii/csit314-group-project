import { expect, it, vi } from "vitest";
import { ViewFavouritesController } from "@/control/ViewFavouritesController";
import { Favourite } from "@/entity/Favourite";
import { makeProject } from "../support/factories";

it("ViewFavouritesController.viewFavourites lists the customer's saved projects (Customer #9)", async () => {
  const projects = [makeProject()];
  const find = vi.spyOn(Favourite, "findProjectsByCustomer").mockResolvedValue(projects);

  expect(await new ViewFavouritesController().viewFavourites(30)).toBe(projects);
  expect(find).toHaveBeenCalledWith(30);
});
