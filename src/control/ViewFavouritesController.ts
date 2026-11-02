import { Favourite } from "@/entity/Favourite";
import type { Project } from "@/entity/Project";

// Customer #9: view my favourite list.
export class ViewFavouritesController {
  async viewFavourites(customerId: number): Promise<Project[]> {
    return Favourite.findProjectsByCustomer(customerId);
  }
}
