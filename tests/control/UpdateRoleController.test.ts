import { describe, expect, it, vi } from "vitest";
import { UpdateRoleController } from "@/control/UpdateRoleController";
import { Role } from "@/entity/Role";
import { makeRole } from "../support/factories";

const update = (id: number, name: string, description = "") =>
  new UpdateRoleController().updateRole(id, name, description);

describe("UpdateRoleController.updateRole (UA #12)", () => {
  it("updates a role's name and description", async () => {
    const role = makeRole({ id: 5, name: "Moderator" });
    vi.spyOn(Role, "findById").mockResolvedValue(role);
    vi.spyOn(Role, "findByName").mockResolvedValue(null);
    const save = vi.spyOn(role, "update").mockResolvedValue();

    expect(await update(5, " Reviewer ", " Checks projects ")).toEqual({ ok: true });
    expect(save).toHaveBeenCalledWith("Reviewer", "Checks projects");
  });

  it("lets a built-in role keep its name and change its description", async () => {
    const role = makeRole({ id: 3, name: "Customer" });
    vi.spyOn(Role, "findById").mockResolvedValue(role);
    vi.spyOn(Role, "findByName").mockResolvedValue(role);
    const save = vi.spyOn(role, "update").mockResolvedValue();

    expect(await update(3, "Customer", "Homeowners")).toEqual({ ok: true });
    expect(save).toHaveBeenCalledWith("Customer", "Homeowners");
  });

  it("requires a name", async () => {
    expect(await update(5, "  ")).toEqual({ ok: false, error: "Role name is required." });
  });

  it("limits the name to 50 characters", async () => {
    expect(await update(5, "x".repeat(51))).toEqual({
      ok: false,
      error: "Role name must be 50 characters or fewer.",
    });
  });

  it("reports a missing role", async () => {
    vi.spyOn(Role, "findById").mockResolvedValue(null);
    vi.spyOn(Role, "findByName").mockResolvedValue(null);

    expect(await update(404, "Reviewer")).toEqual({ ok: false, error: "Role not found." });
  });

  it("rejects a name used by another role", async () => {
    vi.spyOn(Role, "findById").mockResolvedValue(makeRole({ id: 5 }));
    vi.spyOn(Role, "findByName").mockResolvedValue(makeRole({ id: 6, name: "Reviewer" }));

    expect(await update(5, "reviewer")).toEqual({
      ok: false,
      error: 'A role named "reviewer" already exists.',
    });
  });

  it("does not rename a built-in role", async () => {
    vi.spyOn(Role, "findById").mockResolvedValue(makeRole({ id: 3, name: "Customer" }));
    vi.spyOn(Role, "findByName").mockResolvedValue(null);

    expect(await update(3, "Client")).toEqual({ ok: false, error: "Built-in role names cannot be changed." });
  });
});
