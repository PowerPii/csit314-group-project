import bcrypt from "bcryptjs";
import { getDb } from "@/lib/supabase";

type UserAccountRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  is_suspended: boolean;
  role: { name: string; is_suspended: boolean };
};

export class UserAccount {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public phone: string | null,
    public roleName: string,
    public isSuspended: boolean,
    public isRoleSuspended: boolean,
    private passwordHash: string,
  ) {}

  static async findByEmail(email: string): Promise<UserAccount | null> {
    const { data, error } = await getDb()
      .from("user_account")
      .select("id, name, email, phone, password_hash, is_suspended, role(name, is_suspended)")
      .eq("email", email.toLowerCase())
      .maybeSingle<UserAccountRow>();
    if (error) throw new Error(`UserAccount.findByEmail failed: ${error.message}`);
    return data ? UserAccount.fromRow(data) : null;
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  private static fromRow(row: UserAccountRow): UserAccount {
    return new UserAccount(
      row.id,
      row.name,
      row.email,
      row.phone,
      row.role.name,
      row.is_suspended,
      row.role.is_suspended,
      row.password_hash,
    );
  }
}
