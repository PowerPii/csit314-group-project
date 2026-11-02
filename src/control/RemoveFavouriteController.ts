import { Favourite } from "@/entity/Favourite";
import type { ActionResult } from "./validation";

export type RemoveFavouriteResult = ActionResult;

// Customer #11: remove a project from my favourite list.
export class RemoveFavouriteController {
  async removeFavourite(customerId: number, projectId: number): Promise<RemoveFavouriteResult> {
    if (!(await Favourite.remove(customerId, projectId))) {
      return { ok: false, error: "This project is not in your favourites." };
    }
    return { ok: true };
  }
}
