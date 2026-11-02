import { UserAccount } from "@/entity/UserAccount";
import type { ActionResult } from "./validation";

export type SuspendUserAccountResult = ActionResult;

// UA #6: suspend a user account so it can no longer log in.
export class SuspendUserAccountController {
  async suspendUserAccount(id: number, adminId: number): Promise<SuspendUserAccountResult> {
    if (id === adminId) {
      return { ok: false, error: "You cannot suspend your own account." };
    }
    const account = await UserAccount.findById(id);
    if (!account) {
      return { ok: false, error: "Account not found." };
    }
    if (account.isSuspended) {
      return { ok: false, error: "This account is already suspended." };
    }
    await account.setSuspended(true);
    return { ok: true };
  }
}
