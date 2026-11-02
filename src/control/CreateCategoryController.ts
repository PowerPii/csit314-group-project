import { Category } from "@/entity/Category";
import { checkCategoryName } from "./categoryName";

export type CategoryResult = { ok: true; category: Category } | { ok: false; error: string };

// PM #3: create a new project category.
export class CreateCategoryController {
  async createCategory(name: string, description: string): Promise<CategoryResult> {
    const trimmedName = name.trim();
    const error = checkCategoryName(trimmedName);
    if (error) {
      return { ok: false, error };
    }
    if (await Category.findByName(trimmedName)) {
      return { ok: false, error: `A category named "${trimmedName}" already exists.` };
    }
    const category = await Category.create(trimmedName, description.trim());
    return { ok: true, category };
  }
}
