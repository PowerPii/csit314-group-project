"use server";

import { redirect } from "next/navigation";
import { LogoutController } from "@/control/LogoutController";
import { getSession } from "@/lib/session";

export async function logoutAction() {
  new LogoutController().logout(await getSession());
  redirect("/login");
}
