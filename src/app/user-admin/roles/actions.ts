"use server";

import { revalidatePath } from "next/cache";
import { SuspendRoleController } from "@/control/SuspendRoleController";
import { requireRole } from "@/lib/session";
import type { ActionState } from "../../ui";

// SuspendRoleBoundary (UA #13)
export async function suspendRoleAction(id: number, _prev: ActionState): Promise<ActionState> {
  await requireRole("User Admin");
  const result = await new SuspendRoleController().suspendRole(id);
  if (!result.ok) return { error: result.error };
  revalidatePath("/user-admin/roles");
  return {};
}
