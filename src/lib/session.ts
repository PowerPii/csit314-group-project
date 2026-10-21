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
  // Read cookies first: it marks the page as per-request, so `next build` never
  // prerenders it and the secret is only needed at runtime.
  const cookieStore = await cookies();
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters");
  }
  return getIronSession<SessionData>(cookieStore, {
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
