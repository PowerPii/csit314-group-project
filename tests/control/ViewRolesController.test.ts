import { expect, it, vi } from "vitest";
import { ViewRolesController } from "@/control/ViewRolesController";
import { Role } from "@/entity/Role";
import { makeRole } from "../support/factories";

it("ViewRolesController.viewRoles returns every role (UA #11)", async () => {
  const roles = [makeRole({ id: 1 }), makeRole({ id: 2 })];
  vi.spyOn(Role, "findAll").mockResolvedValue(roles);

  expect(await new ViewRolesController().viewRoles()).toEqual(roles);
});
