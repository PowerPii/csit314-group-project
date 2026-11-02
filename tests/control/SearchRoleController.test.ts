import { expect, it, vi } from "vitest";
import { SearchRoleController } from "@/control/SearchRoleController";
import { Role } from "@/entity/Role";
import { makeRole } from "../support/factories";

it("SearchRoleController.searchRoles searches by trimmed name (UA #14)", async () => {
  const found = [makeRole()];
  const search = vi.spyOn(Role, "searchByName").mockResolvedValue(found);

  expect(await new SearchRoleController().searchRoles(" mod ")).toEqual(found);
  expect(search).toHaveBeenCalledWith("mod");
});
