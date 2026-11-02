import { describe, expect, it, vi } from "vitest";
import { DeleteUserAccountController } from "@/control/DeleteUserAccountController";
import { UserAccount } from "@/entity/UserAccount";
import { makeAccount } from "../support/factories";

const remove = (id: number, adminId = 1) => new DeleteUserAccountController().deleteUserAccount(id, adminId);

describe("DeleteUserAccountController.deleteUserAccount (UA #8)", () => {
  it("deletes another account", async () => {
    const account = makeAccount({ id: 7 });
    vi.spyOn(UserAccount, "findById").mockResolvedValue(account);
    const del = vi.spyOn(account, "delete").mockResolvedValue();

    expect(await remove(7)).toEqual({ ok: true });
    expect(del).toHaveBeenCalled();
  });

  it("stops an admin deleting their own account", async () => {
    expect(await remove(1, 1)).toEqual({ ok: false, error: "You cannot delete your own account." });
  });

  it("reports a missing account", async () => {
    vi.spyOn(UserAccount, "findById").mockResolvedValue(null);

    expect(await remove(404)).toEqual({ ok: false, error: "Account not found." });
  });
});
