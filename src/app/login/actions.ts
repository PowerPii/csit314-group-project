"use server";

import { redirect } from "next/navigation";
import { LoginController } from "@/control/LoginController";
import { getSession } from "@/lib/session";
import { ROLE_HOME } from "@/lib/roles";

// email is sent back so the form keeps it after a failed attempt.
export type LoginFormState = { error?: string; email?: string };

export async function loginAction(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await new LoginController().login(email, password);
  if (!result.ok) {
    return { error: result.error, email };
  }

  const session = await getSession();
  session.userAccountId = result.account.id;
  session.name = result.account.name;
  session.roleName = result.account.roleName;
  await session.save();

  redirect(ROLE_HOME[result.account.roleName] ?? "/login");
}
