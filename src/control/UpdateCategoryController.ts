import { Category } from "@/entity/Category";
import { checkCategoryName } from "./categoryName";
import type { CategoryResult } from "./CreateCategoryController";

// PM #5: update a category's name or description.
export class UpdateCategoryController {
  // Loads the category so the edit form can show its current details.
  async getCategory(id: number): Promise<Category | null> {
    return Category.findById(id);
  }

  async updateCategory(id: number, name: string, description: string): Promise<CategoryResult> {
    const trimmedName = name.trim();
    const error = checkCategoryName(trimmedName);
    if (error) {
      return { ok: false, error };
    }

    const [category, sameName] = await Promise.all([Category.findById(id), Category.findByName(trimmedName)]);
    if (!category) {
      return { ok: false, error: "Category not found." };
    }
    if (sameName && sameName.id !== id) {
      return { ok: false, error: `A category named "${trimmedName}" already exists.` };
    }

    await category.update(trimmedName, description.trim());
    return { ok: true, category };
  }
}
