import { UserAccount } from "@/entity/UserAccount";
import type { ActionResult } from "./validation";

export type ReactivateUserAccountResult = ActionResult;

// UA #7: reactivate a suspended user account.
export class ReactivateUserAccountController {
  async reactivateUserAccount(id: number): Promise<ReactivateUserAccountResult> {
    const account = await UserAccount.findById(id);
    if (!account) {
      return { ok: false, error: "Account not found." };
    }
    if (!account.isSuspended) {
      return { ok: false, error: "This account is already active." };
    }
    await account.setSuspended(false);
    return { ok: true };
  }
}
