import { describe, expect, it, vi } from "vitest";
import { SuspendUserAccountController } from "@/control/SuspendUserAccountController";
import { UserAccount } from "@/entity/UserAccount";
import { makeAccount } from "../support/factories";

const suspend = (id: number, adminId = 1) => new SuspendUserAccountController().suspendUserAccount(id, adminId);

describe("SuspendUserAccountController.suspendUserAccount (UA #6)", () => {
  it("suspends an active account", async () => {
    const account = makeAccount({ id: 7 });
    vi.spyOn(UserAccount, "findById").mockResolvedValue(account);
    const set = vi.spyOn(account, "setSuspended").mockResolvedValue();

    expect(await suspend(7)).toEqual({ ok: true });
    expect(set).toHaveBeenCalledWith(true);
  });

  it("stops an admin suspending their own account", async () => {
    const find = vi.spyOn(UserAccount, "findById");

    expect(await suspend(1, 1)).toEqual({ ok: false, error: "You cannot suspend your own account." });
    expect(find).not.toHaveBeenCalled();
  });

  it("reports a missing account", async () => {
    vi.spyOn(UserAccount, "findById").mockResolvedValue(null);

    expect(await suspend(404)).toEqual({ ok: false, error: "Account not found." });
  });

  it("rejects an account that is already suspended", async () => {
    vi.spyOn(UserAccount, "findById").mockResolvedValue(makeAccount({ isSuspended: true }));

    expect(await suspend(7)).toEqual({ ok: false, error: "This account is already suspended." });
  });
});
