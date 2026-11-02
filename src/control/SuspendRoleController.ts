import { Role } from "@/entity/Role";
import type { ActionResult } from "./validation";

export type SuspendRoleResult = ActionResult;

// UA #13: suspend a role, which blocks every account with that role from logging in.
export class SuspendRoleController {
  async suspendRole(id: number): Promise<SuspendRoleResult> {
    const role = await Role.findById(id);
    if (!role) {
      return { ok: false, error: "Role not found." };
    }
    if (role.name === "User Admin") {
      return { ok: false, error: "The User Admin role cannot be suspended." };
    }
    if (role.isSuspended) {
      return { ok: false, error: "This role is already suspended." };
    }
    await role.setSuspended(true);
    return { ok: true };
  }
}
