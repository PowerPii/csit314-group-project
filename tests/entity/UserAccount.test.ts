import bcrypt from "bcryptjs";
import { beforeAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { Role } from "@/entity/Role";
import { UserAccount } from "@/entity/UserAccount";

const email = `entity-test-${Date.now()}@example.com`;

describe("UserAccount (local Supabase)", () => {
  beforeAll(async () => {
    const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
    const { data: role } = await db
      .from("role")
      .insert({ name: `Entity test ${Date.now()}` })
      .select()
      .single();
    await db.from("user_account").insert({
      name: "Entity Test",
      email,
      password_hash: await bcrypt.hash("Password123!", 4),
      role_id: role!.id,
    });
  });

  it("finds an account by email with its role and checks the password", async () => {
    const account = await UserAccount.findByEmail(email.toUpperCase());

    expect(account?.name).toBe("Entity Test");
    expect(account?.roleName).toMatch(/^Entity test/);
    expect(await account?.verifyPassword("Password123!")).toBe(true);
    expect(await account?.verifyPassword("wrong")).toBe(false);
  });
});

describe("UserAccount create, search, update, suspend and delete (local Supabase)", () => {
  it("runs through an account's whole life cycle", async () => {
    const roles = await Role.findAll();
    const customer = roles.find((r) => r.name === "Customer") ?? (await Role.create(`Customer ${Date.now()}`, ""));
    const stamp = Date.now();
    const before = new Date(Date.now() - 1000);

    const created = await UserAccount.create("Life Cycle", `Life.${stamp}@Example.com`, null, "Password123!", customer.id);
    expect(created.email).toBe(`life.${stamp}@example.com`);
    expect(created.roleName).toBe(customer.name);
    expect(await created.verifyPassword("Password123!")).toBe(true);

    expect((await UserAccount.searchByEmail(`life.${stamp}`)).map((a) => a.id)).toEqual([created.id]);
    expect((await UserAccount.findAll()).some((a) => a.id === created.id)).toBe(true);
    expect(await UserAccount.countCreatedBetween(before, new Date(Date.now() + 1000), customer.name)).toBeGreaterThanOrEqual(1);

    await created.update("Renamed", `renamed.${stamp}@example.com`, "+65 9000 0000", customer.id);
    await created.setSuspended(true);
    const reloaded = await UserAccount.findById(created.id);
    expect(reloaded).toMatchObject({ name: "Renamed", phone: "+65 9000 0000", isSuspended: true });

    await created.delete();
    expect(await UserAccount.findById(created.id)).toBeNull();
  });

  it("treats % and _ in a search as plain characters", async () => {
    expect(await UserAccount.searchByEmail("%_%_no-such-email")).toEqual([]);
  });
});
