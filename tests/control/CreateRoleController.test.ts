import { describe, expect, it, vi } from "vitest";
import { CreateRoleController } from "@/control/CreateRoleController";
import { Role } from "@/entity/Role";

describe("CreateRoleController.createRole", () => {
  it("creates a role with a trimmed name and description", async () => {
    vi.spyOn(Role, "findByName").mockResolvedValue(null);
    const create = vi
      .spyOn(Role, "create")
      .mockResolvedValue(new Role(1, "Moderator", "Reviews projects", false));

    const result = await new CreateRoleController().createRole("  Moderator ", " Reviews projects ");

    expect(create).toHaveBeenCalledWith("Moderator", "Reviews projects");
    expect(result).toEqual({ ok: true, role: expect.objectContaining({ name: "Moderator" }) });
  });

  it("rejects an empty name without touching the database", async () => {
    const create = vi.spyOn(Role, "create");

    const result = await new CreateRoleController().createRole("   ", "");

    expect(result).toEqual({ ok: false, error: "Role name is required." });
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects a name longer than 50 characters", async () => {
    const result = await new CreateRoleController().createRole("x".repeat(51), "");

    expect(result).toEqual({ ok: false, error: "Role name must be 50 characters or fewer." });
  });

  it("rejects a duplicate role name", async () => {
    vi.spyOn(Role, "findByName").mockResolvedValue(new Role(2, "Customer", "", false));
    const create = vi.spyOn(Role, "create");

    const result = await new CreateRoleController().createRole("customer", "");

    expect(result).toEqual({ ok: false, error: 'A role named "customer" already exists.' });
    expect(create).not.toHaveBeenCalled();
  });
});
