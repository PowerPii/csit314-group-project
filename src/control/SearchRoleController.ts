import { Role } from "@/entity/Role";

// UA #14: search roles by name.
export class SearchRoleController {
  async searchRoles(name: string): Promise<Role[]> {
    return Role.searchByName(name.trim());
  }
}
