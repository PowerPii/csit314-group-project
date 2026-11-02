"use server";

import { UpdateCategoryController } from "@/control/UpdateCategoryController";
import { requireRole } from "@/lib/session";
import type { CategoryFormState } from "../../CategoryForm";

export async function updateCategoryAction(id: number, _prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireRole("Platform Manager");
  const values = { name: String(formData.get("name") ?? ""), description: String(formData.get("description") ?? "") };

  const result = await new UpdateCategoryController().updateCategory(id, values.name, values.description);
  return result.ok ? { message: "Category updated.", values } : { error: result.error, values };
}
