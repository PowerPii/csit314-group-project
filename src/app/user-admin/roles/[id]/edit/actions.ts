"use server";

import { revalidatePath } from "next/cache";
import { UpdateRoleController } from "@/control/UpdateRoleController";
import { requireRole } from "@/lib/session";
import type { ActionState } from "../../../../ui";

export async function updateRoleAction(id: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("User Admin");

  const result = await new UpdateRoleController().updateRole(
    id,
    String(formData.get("name") ?? ""),
    String(formData.get("description") ?? ""),
  );
  if (!result.ok) return { error: result.error };
  revalidatePath("/user-admin/roles");
  return { message: "Role updated." };
}
