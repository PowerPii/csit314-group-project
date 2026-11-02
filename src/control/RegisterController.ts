import { Role } from "@/entity/Role";
import { UserAccount } from "@/entity/UserAccount";
import { blankToNull, isValidEmail } from "./validation";

export type RegisterResult = { ok: true; account: UserAccount } | { ok: false; error: string };

// Customer #1: register a new customer account.
export class RegisterController {
  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
  ): Promise<RegisterResult> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail || !password) {
      return { ok: false, error: "Name, email and password are required." };
    }
    if (!isValidEmail(trimmedEmail)) {
      return { ok: false, error: "Enter a valid email address." };
    }
    if (password.length < 8) {
      return { ok: false, error: "Password must be at least 8 characters." };
    }
    if (password !== confirmPassword) {
      return { ok: false, error: "Passwords do not match." };
    }

    if (await UserAccount.findByEmail(trimmedEmail)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const customerRole = await Role.findByName("Customer");
    if (!customerRole) throw new Error("The Customer role is missing. Run the seed script.");

    const account = await UserAccount.create(trimmedName, trimmedEmail, blankToNull(phone), password, customerRole.id);
    return { ok: true, account };
  }
}
