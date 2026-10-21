"use server";

import { CreateRoleController } from "@/control/CreateRoleController";
import { requireRole } from "@/lib/session";

// name and description are sent back so the form keeps them after an error.
export type CreateRoleFormState = {
  error?: string;
  created?: string;
  name?: string;
  description?: string;
};

export async function createRoleAction(
  _prev: CreateRoleFormState,
  formData: FormData,
): Promise<CreateRoleFormState> {
  await requireRole("User Admin");

  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");

  const result = await new CreateRoleController().createRole(name, description);
  return result.ok ? { created: result.role.name } : { error: result.error, name, description };
}
