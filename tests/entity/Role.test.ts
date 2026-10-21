import { describe, expect, it } from "vitest";
import { Role } from "@/entity/Role";

describe("Role (local Supabase)", () => {
  it("creates a role and finds it by name, ignoring case", async () => {
    const name = `Test role ${Date.now()}`;

    const created = await Role.create(name, "Created by an integration test");
    const found = await Role.findByName(name.toUpperCase());

    expect(created.id).toBeGreaterThan(0);
    expect(created.isSuspended).toBe(false);
    expect(found).toEqual(created);
  });

  it("returns null for a role that does not exist", async () => {
    expect(await Role.findByName("No such role")).toBeNull();
  });
});
