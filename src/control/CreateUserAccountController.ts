import { Role } from "@/entity/Role";
import { UserAccount } from "@/entity/UserAccount";
import { blankToNull, isValidEmail } from "./validation";

export type CreateUserAccountResult =
  | { ok: true; account: UserAccount }
  | { ok: false; error: string };

// UA #3: create a user account for any actor.
export class CreateUserAccountController {
  async createUserAccount(
    name: string,
    email: string,
    phone: string,
    password: string,
    roleId: number,
  ): Promise<CreateUserAccountResult> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail || !password) {
      return { ok: false, error: "Name, email and password are required." };
    }
    if (!isValidEmail(trimmedEmail)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    if (password.length < 8) {
      return { ok: false, error: "Password must be at least 8 characters." };
    }

    const [existing, role] = await Promise.all([UserAccount.findByEmail(trimmedEmail), Role.findById(roleId)]);
    if (existing) {
      return { ok: false, error: "An account with this email already exists." };
    }
    if (!role) {
      return { ok: false, error: "Choose a role." };
    }

    const account = await UserAccount.create(trimmedName, trimmedEmail, blankToNull(phone), password, roleId);
    return { ok: true, account };
  }
}
