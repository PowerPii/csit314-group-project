import { expect, it, vi } from "vitest";
import { SearchUserAccountController } from "@/control/SearchUserAccountController";
import { UserAccount } from "@/entity/UserAccount";
import { makeAccount } from "../support/factories";

it("SearchUserAccountController.searchUserAccounts searches by trimmed email (UA #9)", async () => {
  const found = [makeAccount()];
  const search = vi.spyOn(UserAccount, "searchByEmail").mockResolvedValue(found);

  expect(await new SearchUserAccountController().searchUserAccounts("  alex@ ")).toEqual(found);
  expect(search).toHaveBeenCalledWith("alex@");
});
