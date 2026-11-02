import { UserAccount } from "@/entity/UserAccount";
import type { ActionResult } from "./validation";

export type DeleteUserAccountResult = ActionResult;

// UA #8: delete a user account (its profile, projects and favourites go with it).
export class DeleteUserAccountController {
  async deleteUserAccount(id: number, adminId: number): Promise<DeleteUserAccountResult> {
    if (id === adminId) {
      return { ok: false, error: "You cannot delete your own account." };
    }
    const account = await UserAccount.findById(id);
    if (!account) {
      return { ok: false, error: "Account not found." };
    }
    await account.delete();
    return { ok: true };
  }
}
