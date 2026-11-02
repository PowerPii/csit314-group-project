import { describe, expect, it, vi } from "vitest";
import { RegisterController } from "@/control/RegisterController";
import { Role } from "@/entity/Role";
import { UserAccount } from "@/entity/UserAccount";
import { makeAccount, makeRole } from "../support/factories";

const register = (name: string, email: string, password = "Password123!", confirm = password, phone = "") =>
  new RegisterController().register(name, email, phone, password, confirm);

describe("RegisterController.register (Customer #1)", () => {
  it("creates a Customer account", async () => {
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(null);
    vi.spyOn(Role, "findByName").mockResolvedValue(makeRole({ id: 3, name: "Customer" }));
    const saved = makeAccount();
    const create = vi.spyOn(UserAccount, "create").mockResolvedValue(saved);

    expect(await register(" Casey ", " casey@demo.com ", "Password123!", "Password123!", " 9123 4567 ")).toEqual({
      ok: true,
      account: saved,
    });
    expect(create).toHaveBeenCalledWith("Casey", "casey@demo.com", "9123 4567", "Password123!", 3);
  });

  it.each([
    ["", "a@b.com", "Password123!", "Password123!", "Name, email and password are required."],
    ["Casey", "a@b", "Password123!", "Password123!", "Enter a valid email address."],
    ["Casey", "a@b.com", "short", "short", "Password must be at least 8 characters."],
    ["Casey", "a@b.com", "Password123!", "Password124!", "Passwords do not match."],
  ])("rejects name=%j email=%j", async (name, email, password, confirm, error) => {
    expect(await register(name, email, password, confirm)).toEqual({ ok: false, error });
  });

  it("rejects an email that is already registered", async () => {
    vi.spyOn(UserAccount, "findByEmail").mockResolvedValue(makeAccount());
    const create = vi.spyOn(UserAccount, "create");

    expect(await register("Casey", "alex@example.com")).toEqual({
      ok: false,
      error: "An account with this email already exists.",
    });
    expect(create).not.toHaveBeenCalled();
  });
});
