import { UserAccount } from "@/entity/UserAccount";

// UA #4: view all user accounts.
export class ViewUserAccountsController {
  async viewUserAccounts(): Promise<UserAccount[]> {
    return UserAccount.findAll();
  }
}
