import { Category } from "@/entity/Category";

// PM #7: search categories by keyword (name or description).
export class SearchCategoryController {
  async searchCategories(keyword: string): Promise<Category[]> {
    return Category.searchByName(keyword.trim());
  }
}
