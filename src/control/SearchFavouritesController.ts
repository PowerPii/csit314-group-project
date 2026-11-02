import { Favourite } from "@/entity/Favourite";
import type { Project } from "@/entity/Project";

// Customer #10: search my favourite list by title or category.
export class SearchFavouritesController {
  async searchFavourites(customerId: number, keyword: string, categoryId: number | null): Promise<Project[]> {
    return Favourite.searchProjectsByCustomer(customerId, keyword.trim(), categoryId);
  }
}
