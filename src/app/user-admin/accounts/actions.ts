"use server";

import { revalidatePath } from "next/cache";
import { DeleteUserAccountController } from "@/control/DeleteUserAccountController";
import { ReactivateUserAccountController } from "@/control/ReactivateUserAccountController";
import { SuspendUserAccountController } from "@/control/SuspendUserAccountController";
import { requireRole } from "@/lib/session";
import type { ActionState } from "../../ui";

// SuspendUserAccountBoundary (UA #6)
export async function suspendUserAccountAction(id: number, _prev: ActionState): Promise<ActionState> {
  const session = await requireRole("User Admin");
  const result = await new SuspendUserAccountController().suspendUserAccount(id, session.userAccountId!);
  if (!result.ok) return { error: result.error };
  revalidatePath("/user-admin/accounts");
  return {};
}

// ReactivateUserAccountBoundary (UA #7)
export async function reactivateUserAccountAction(id: number, _prev: ActionState): Promise<ActionState> {
  await requireRole("User Admin");
  const result = await new ReactivateUserAccountController().reactivateUserAccount(id);
  if (!result.ok) return { error: result.error };
  revalidatePath("/user-admin/accounts");
  return {};
}

// DeleteUserAccountBoundary (UA #8)
export async function deleteUserAccountAction(id: number, _prev: ActionState): Promise<ActionState> {
  const session = await requireRole("User Admin");
  const result = await new DeleteUserAccountController().deleteUserAccount(id, session.userAccountId!);
  if (!result.ok) return { error: result.error };
  revalidatePath("/user-admin/accounts");
  return {};
}
