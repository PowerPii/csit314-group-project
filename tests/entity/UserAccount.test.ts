import bcrypt from "bcryptjs";
import { beforeAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
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
