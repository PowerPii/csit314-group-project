"use server";

import { CreateCategoryController } from "@/control/CreateCategoryController";
import { requireRole } from "@/lib/session";
import type { CategoryFormState } from "../CategoryForm";

export async function createCategoryAction(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireRole("Platform Manager");
  const values = { name: String(formData.get("name") ?? ""), description: String(formData.get("description") ?? "") };

  const result = await new CreateCategoryController().createCategory(values.name, values.description);
  return result.ok ? { message: `Category "${result.category.name}" created.` } : { error: result.error, values };
}
