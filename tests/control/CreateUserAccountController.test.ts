import { describe, expect, it, vi } from "vitest";
import { CreateUserAccountController } from "@/control/CreateUserAccountController";
import { Role } from "@/entity/Role";
import { UserAccount } from "@/entity/UserAccount";
import { makeAccount, makeRole } from "../support/factories";

const create = (name: string, email: string, phone: string, password: string, roleId = 4) =>
  new CreateUserAccountController().createUserAccount(name, email, phone, password, roleId);

describe("CreateUserAccountController.createUserAccount (UA #3)", () => {
  it("creates an account with trimmed input and an empty phone stored as null", async () => {
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(null);
    vi.spyOn(Role, "findById").mockResolvedValue(makeRole({ id: 4, name: "Platform Manager" }));
    const saved = makeAccount({ name: "Pat", email: "pat@demo.com" });
    const insert = vi.spyOn(UserAccount, "create").mockResolvedValue(saved);

    const result = await create(" Pat ", " pat@demo.com ", "  ", "Password123!");

    expect(insert).toHaveBeenCalledWith("Pat", "pat@demo.com", null, "Password123!", 4);
    expect(result).toEqual({ ok: true, account: saved });
  });

  it.each([
    ["", "a@b.com", "Password123!", "Name, email and password are required."],
    ["Pat", "", "Password123!", "Name, email and password are required."],
    ["Pat", "a@b.com", "", "Name, email and password are required."],
    ["Pat", "not-an-email", "Password123!", "Enter a valid email address."],
    ["Pat", "a@b.com", "short", "Password must be at least 8 characters."],
  ])("rejects name=%j email=%j password=%j", async (name, email, password, error) => {
    const insert = vi.spyOn(UserAccount, "create");

    expect(await create(name, email, "", password)).toEqual({ ok: false, error });
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects an email that is already used", async () => {
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(makeAccount());
    vi.spyOn(Role, "findById").mockResolvedValue(makeRole());
    const insert = vi.spyOn(UserAccount, "create");

    expect(await create("Pat", "alex@example.com", "", "Password123!")).toEqual({
      ok: false,
      error: "An account with this email already exists.",
    });
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects a role that does not exist", async () => {
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(null);
    vi.spyOn(Role, "findById").mockResolvedValue(null);

    expect(await create("Pat", "pat@demo.com", "", "Password123!", 99)).toEqual({
      ok: false,
      error: "Choose a role.",
    });
  });
});
