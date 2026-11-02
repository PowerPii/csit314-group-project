import { expect, it, vi } from "vitest";
import { ViewUserAccountsController } from "@/control/ViewUserAccountsController";
import { UserAccount } from "@/entity/UserAccount";
import { makeAccount } from "../support/factories";

it("ViewUserAccountsController.viewUserAccounts returns every account (UA #4)", async () => {
  const accounts = [makeAccount({ id: 1 }), makeAccount({ id: 2 })];
  vi.spyOn(UserAccount, "findAll").mockResolvedValue(accounts);

  expect(await new ViewUserAccountsController().viewUserAccounts()).toEqual(accounts);
});
