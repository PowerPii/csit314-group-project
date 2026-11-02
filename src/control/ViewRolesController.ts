import { Role } from "@/entity/Role";

// UA #11: view all roles.
export class ViewRolesController {
  async viewRoles(): Promise<Role[]> {
    return Role.findAll();
  }
}
