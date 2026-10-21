import { UserAccount } from "@/entity/UserAccount";

export type LoginResult =
  | { ok: true; account: UserAccount }
  | { ok: false; error: string };

// Shared by the login story of every actor (UA #1, ID #1, Customer, PM).
export class LoginController {
  async login(email: string, password: string): Promise<LoginResult> {
    if (!email.trim() || !password) {
      return { ok: false, error: "Enter your email and password." };
    }

    const account = await UserAccount.findByEmail(email.trim());
    if (!account || !(await account.verifyPassword(password))) {
      return { ok: false, error: "Invalid email or password." };
    }
    if (account.isSuspended) {
      return { ok: false, error: "This account is suspended." };
    }
    if (account.isRoleSuspended) {
      return { ok: false, error: `The ${account.roleName} role is suspended.` };
    }
    return { ok: true, account };
  }
}
