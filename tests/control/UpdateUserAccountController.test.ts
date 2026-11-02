import { describe, expect, it, vi } from "vitest";
import { UpdateUserAccountController } from "@/control/UpdateUserAccountController";
import { UserAccount } from "@/entity/UserAccount";
import { makeAccount } from "../support/factories";

const update = (id: number, name: string, email: string, phone = "", roleId = 3) =>
  new UpdateUserAccountController().updateUserAccount(id, name, email, phone, roleId);

describe("UpdateUserAccountController.updateUserAccount (UA #5)", () => {
  it("updates name, email, phone and role", async () => {
    const account = makeAccount({ id: 7 });
    vi.spyOn(UserAccount, "findById").mockResolvedValue(account);
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(account);
    const save = vi.spyOn(account, "update").mockResolvedValue();

    const result = await update(7, " Alex Lee ", "alex@example.com", " +65 9123 4567 ", 2);

    expect(save).toHaveBeenCalledWith("Alex Lee", "alex@example.com", "+65 9123 4567", 2);
    expect(result).toEqual({ ok: true });
  });

  it("requires a name and email", async () => {
    expect(await update(7, " ", "a@b.com")).toEqual({ ok: false, error: "Name and email are required." });
  });

  it("rejects an invalid email", async () => {
    expect(await update(7, "Alex", "nope")).toEqual({ ok: false, error: "Enter a valid email address." });
  });

  it("reports a missing account", async () => {
    vi.spyOn(UserAccount, "findById").mockResolvedValue(null);
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(null);

    expect(await update(404, "Alex", "a@b.com")).toEqual({ ok: false, error: "Account not found." });
  });

  it("rejects an email that belongs to another account", async () => {
    const account = makeAccount({ id: 7 });
    vi.spyOn(UserAccount, "findById").mockResolvedValue(account);
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(makeAccount({ id: 8 }));
    const save = vi.spyOn(account, "update");

    expect(await update(7, "Alex", "taken@demo.com")).toEqual({
      ok: false,
      error: "An account with this email already exists.",
    });
    expect(save).not.toHaveBeenCalled();
  });
});
