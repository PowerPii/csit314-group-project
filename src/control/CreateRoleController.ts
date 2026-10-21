import { Role } from "@/entity/Role";

export type CreateRoleResult =
  | { ok: true; role: Role }
  | { ok: false; error: string };

// UA #10: create a new role (user profile).
export class CreateRoleController {
  async createRole(name: string, description: string): Promise<CreateRoleResult> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { ok: false, error: "Role name is required." };
    }
    if (trimmedName.length > 50) {
      return { ok: false, error: "Role name must be 50 characters or fewer." };
    }
    if (await Role.findByName(trimmedName)) {
      return { ok: false, error: `A role named "${trimmedName}" already exists.` };
    }

    const role = await Role.create(trimmedName, description.trim());
    return { ok: true, role };
  }
}
