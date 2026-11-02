import { describe, expect, it, vi } from "vitest";
import { SuspendRoleController } from "@/control/SuspendRoleController";
import { Role } from "@/entity/Role";
import { makeRole } from "../support/factories";

const suspend = (id: number) => new SuspendRoleController().suspendRole(id);

describe("SuspendRoleController.suspendRole (UA #13)", () => {
  it("suspends an active role", async () => {
    const role = makeRole();
    vi.spyOn(Role, "findById").mockResolvedValue(role);
    const set = vi.spyOn(role, "setSuspended").mockResolvedValue();

    expect(await suspend(5)).toEqual({ ok: true });
    expect(set).toHaveBeenCalledWith(true);
  });

  it("reports a missing role", async () => {
    vi.spyOn(Role, "findById").mockResolvedValue(null);

    expect(await suspend(404)).toEqual({ ok: false, error: "Role not found." });
  });

  it("never suspends the User Admin role", async () => {
    vi.spyOn(Role, "findById").mockResolvedValue(makeRole({ name: "User Admin" }));

    expect(await suspend(1)).toEqual({ ok: false, error: "The User Admin role cannot be suspended." });
  });

  it("rejects a role that is already suspended", async () => {
    vi.spyOn(Role, "findById").mockResolvedValue(makeRole({ isSuspended: true }));

    expect(await suspend(5)).toEqual({ ok: false, error: "This role is already suspended." });
  });
});
