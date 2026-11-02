import { describe, expect, it, vi } from "vitest";
import { LoginController } from "@/control/LoginController";
import { UserAccount } from "@/entity/UserAccount";
import { makeAccount } from "../support/factories";

function account(overrides: { isSuspended?: boolean; isRoleSuspended?: boolean; passwordOk?: boolean } = {}) {
  const acc = makeAccount({
    isSuspended: overrides.isSuspended ?? false,
    isRoleSuspended: overrides.isRoleSuspended ?? false,
  });
  vi.spyOn(acc, "verifyPassword").mockResolvedValue(overrides.passwordOk ?? true);
  return acc;
}

describe("LoginController.login", () => {
  it("logs in an active account with the right password", async () => {
    const acc = account();
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(acc);

    const result = await new LoginController().login("alex@example.com", "Password123!");

    expect(result).toEqual({ ok: true, account: acc });
  });

  it("asks for both fields when one is empty", async () => {
    const result = await new LoginController().login("", "");

    expect(result).toEqual({ ok: false, error: "Enter your email and password." });
  });

  it("gives the same error for an unknown email and a wrong password", async () => {
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValueOnce(null);
    const unknown = await new LoginController().login("nobody@example.com", "x");

    vi.spyOn(UserAccount, "findByEmail").mockResolvedValueOnce(account({ passwordOk: false }));
    const wrong = await new LoginController().login("alex@example.com", "wrong");

    expect(unknown).toEqual({ ok: false, error: "Invalid email or password." });
    expect(wrong).toEqual(unknown);
  });

  it("blocks a suspended account", async () => {
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(account({ isSuspended: true }));

    const result = await new LoginController().login("alex@example.com", "Password123!");

    expect(result).toEqual({ ok: false, error: "This account is suspended." });
  });

  it("blocks an account whose role is suspended (UA #13)", async () => {
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(account({ isRoleSuspended: true }));

    const result = await new LoginController().login("alex@example.com", "Password123!");

    expect(result).toEqual({ ok: false, error: "The Customer role is suspended." });
  });
});
