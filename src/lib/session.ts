import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";

export type SessionData = {
  userAccountId?: number;
  name?: string;
  roleName?: string;
};

export async function getSession() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters");
  }
  return getIronSession<SessionData>(await cookies(), {
    password,
    cookieName: "renovation_session",
  });
}

// Use at the top of every actor page: sends anyone without the right role to the login page.
export async function requireRole(roleName: string) {
  const session = await getSession();
  if (!session.userAccountId || session.roleName !== roleName) {
    redirect("/login");
  }
  return session;
}
