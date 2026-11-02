"use server";

import { redirect } from "next/navigation";
import { RegisterController } from "@/control/RegisterController";
import { getSession } from "@/lib/session";

export type RegisterFormState = { error?: string; values?: { name: string; email: string; phone: string } };

export async function registerAction(_prev: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
  };
  const result = await new RegisterController().register(
    values.name,
    values.email,
    values.phone,
    String(formData.get("password") ?? ""),
    String(formData.get("confirmPassword") ?? ""),
  );
  if (!result.ok) return { error: result.error, values };

  // Registered customers are logged in straight away.
  const session = await getSession();
  session.userAccountId = result.account.id;
  session.name = result.account.name;
  session.roleName = result.account.roleName;
  await session.save();
  redirect("/customer");
}
