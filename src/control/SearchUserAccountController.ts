import { UserAccount } from "@/entity/UserAccount";

// UA #9: search user accounts by email.
export class SearchUserAccountController {
  async searchUserAccounts(email: string): Promise<UserAccount[]> {
    return UserAccount.searchByEmail(email.trim());
  }
}
