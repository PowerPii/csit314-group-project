"use server";

import { revalidatePath } from "next/cache";
import { UpdateUserAccountController } from "@/control/UpdateUserAccountController";
import { requireRole } from "@/lib/session";
import type { ActionState } from "../../../../ui";

export async function updateUserAccountAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole("User Admin");

  const result = await new UpdateUserAccountController().updateUserAccount(
    id,
    String(formData.get("name") ?? ""),
    String(formData.get("email") ?? ""),
    String(formData.get("phone") ?? ""),
    Number(formData.get("roleId")),
  );
  if (!result.ok) return { error: result.error };
  revalidatePath("/user-admin/accounts");
  return { message: "Account updated." };
}
