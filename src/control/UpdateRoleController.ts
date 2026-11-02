import { Role } from "@/entity/Role";
import { ROLE_HOME } from "@/lib/roles";
import type { ActionResult } from "./validation";

export type UpdateRoleResult = ActionResult;

// UA #12: update a role's name and description.
export class UpdateRoleController {
  // Loads the role so the edit form can show its current details.
  async getRole(id: number): Promise<Role | null> {
    return Role.findById(id);
  }

  async updateRole(id: number, name: string, description: string): Promise<UpdateRoleResult> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { ok: false, error: "Role name is required." };
    }
    if (trimmedName.length > 50) {
      return { ok: false, error: "Role name must be 50 characters or fewer." };
    }

    const [role, sameName] = await Promise.all([Role.findById(id), Role.findByName(trimmedName)]);
    if (!role) {
      return { ok: false, error: "Role not found." };
    }
    if (sameName && sameName.id !== id) {
      return { ok: false, error: `A role named "${trimmedName}" already exists.` };
    }
    // Login sends each built-in role to its home page by name, so those names are fixed.
    if (Object.hasOwn(ROLE_HOME, role.name) && role.name !== trimmedName) {
      return { ok: false, error: "Built-in role names cannot be changed." };
    }

    await role.update(trimmedName, description.trim());
    return { ok: true };
  }
}
