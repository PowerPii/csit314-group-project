import { Category } from "@/entity/Category";
import { Project } from "@/entity/Project";

export type DeleteCategoryResult = { ok: true; moved: number } | { ok: false; error: string };

// PM #6: delete a category, first moving its projects to another category so none are left uncategorised.
export class DeleteCategoryController {
  // The category and how many projects it holds, for the delete page.
  async getDeleteInfo(id: number): Promise<{ category: Category; projectCount: number } | null> {
    const [category, projectCount] = await Promise.all([Category.findById(id), Project.countByCategory(id)]);
    return category ? { category, projectCount } : null;
  }

  async deleteCategory(id: number, reassignToId: number | null): Promise<DeleteCategoryResult> {
    if (reassignToId === id) {
      return { ok: false, error: "Choose a different category to move the projects to." };
    }

    const [category, count] = await Promise.all([Category.findById(id), Project.countByCategory(id)]);
    if (!category) {
      return { ok: false, error: "Category not found." };
    }
    if (count > 0 && (reassignToId === null || !(await Category.findById(reassignToId)))) {
      return { ok: false, error: `Choose a category to move its ${count} projects to.` };
    }

    const moved = count > 0 ? await Project.reassignCategory(id, reassignToId!) : 0;
    await category.delete();
    return { ok: true, moved };
  }
}
