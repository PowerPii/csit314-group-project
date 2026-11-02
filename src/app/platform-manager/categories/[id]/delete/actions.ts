"use server";

import { DeleteCategoryController } from "@/control/DeleteCategoryController";
import { requireRole } from "@/lib/session";
import type { ActionState } from "../../../../ui";

export async function deleteCategoryAction(id: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("Platform Manager");
  const target = String(formData.get("reassignToId") ?? "");

  const result = await new DeleteCategoryController().deleteCategory(id, target ? Number(target) : null);
  if (!result.ok) return { error: result.error };
  return { message: `Category deleted. ${result.moved} project(s) moved.` };
}
