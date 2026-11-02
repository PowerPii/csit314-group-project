import { Category } from "@/entity/Category";

// PM #4: view all project categories. Also fills the category drop-downs on project forms.
export class ViewCategoriesController {
  async viewCategories(): Promise<Category[]> {
    return Category.findAll();
  }
}
