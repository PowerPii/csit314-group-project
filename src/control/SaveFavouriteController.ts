import { Favourite } from "@/entity/Favourite";
import { Project } from "@/entity/Project";
import type { ActionResult } from "./validation";

export type SaveFavouriteResult = ActionResult;

// Customer #8: save a project to my favourite list.
export class SaveFavouriteController {
  async saveFavourite(customerId: number, projectId: number): Promise<SaveFavouriteResult> {
    const [project, alreadySaved] = await Promise.all([
      Project.findById(projectId),
      Favourite.exists(customerId, projectId),
    ]);
    if (!project) {
      return { ok: false, error: "Project not found." };
    }
    if (alreadySaved) {
      return { ok: false, error: "This project is already in your favourites." };
    }
    await Favourite.create(customerId, projectId);
    return { ok: true };
  }
}
