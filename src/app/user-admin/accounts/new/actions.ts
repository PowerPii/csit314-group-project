"use server";

import { CreateUserAccountController } from "@/control/CreateUserAccountController";
import { requireRole } from "@/lib/session";

// Everything but the password is sent back so the form keeps it after an error.
export type CreateUserAccountFormState = {
  error?: string;
  created?: string;
  values?: { name: string; email: string; phone: string; roleId: string };
};

export async function createUserAccountAction(
  _prev: CreateUserAccountFormState,
  formData: FormData,
): Promise<CreateUserAccountFormState> {
  await requireRole("User Admin");

  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    roleId: String(formData.get("roleId") ?? ""),
  };
  const password = String(formData.get("password") ?? "");

  const result = await new CreateUserAccountController().createUserAccount(
    values.name,
    values.email,
    values.phone,
    password,
    Number(values.roleId),
  );
  return result.ok ? { created: result.account.name } : { error: result.error, values };
}
