import { describe, expect, it, vi } from "vitest";
import { ReactivateUserAccountController } from "@/control/ReactivateUserAccountController";
import { UserAccount } from "@/entity/UserAccount";
import { makeAccount } from "../support/factories";

const reactivate = (id: number) => new ReactivateUserAccountController().reactivateUserAccount(id);

describe("ReactivateUserAccountController.reactivateUserAccount (UA #7)", () => {
  it("reactivates a suspended account", async () => {
    const account = makeAccount({ isSuspended: true });
    vi.spyOn(UserAccount, "findById").mockResolvedValue(account);
    const set = vi.spyOn(account, "setSuspended").mockResolvedValue();

    expect(await reactivate(7)).toEqual({ ok: true });
    expect(set).toHaveBeenCalledWith(false);
  });

  it("reports a missing account", async () => {
    vi.spyOn(UserAccount, "findById").mockResolvedValue(null);

    expect(await reactivate(404)).toEqual({ ok: false, error: "Account not found." });
  });

  it("rejects an account that is already active", async () => {
    vi.spyOn(UserAccount, "findById").mockResolvedValue(makeAccount());

    expect(await reactivate(7)).toEqual({ ok: false, error: "This account is already active." });
  });
});
