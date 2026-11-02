import { UserAccount } from "@/entity/UserAccount";
import { blankToNull, isValidEmail, type ActionResult } from "./validation";

export type UpdateUserAccountResult = ActionResult;

// UA #5: update an account's name, email, phone and role.
export class UpdateUserAccountController {
  // Loads the account so the edit form can show its current details.
  async getUserAccount(id: number): Promise<UserAccount | null> {
    return UserAccount.findById(id);
  }

  async updateUserAccount(
    id: number,
    name: string,
    email: string,
    phone: string,
    roleId: number,
  ): Promise<UpdateUserAccountResult> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) {
      return { ok: false, error: "Name and email are required." };
    }
    if (!isValidEmail(trimmedEmail)) {
      return { ok: false, error: "Enter a valid email address." };
    }

    const [account, sameEmail] = await Promise.all([
      UserAccount.findById(id),
      UserAccount.findByEmail(trimmedEmail),
    ]);
    if (!account) {
      return { ok: false, error: "Account not found." };
    }
    if (sameEmail && sameEmail.id !== id) {
      return { ok: false, error: "An account with this email already exists." };
    }

    await account.update(trimmedName, trimmedEmail, blankToNull(phone), roleId);
    return { ok: true };
  }
}
