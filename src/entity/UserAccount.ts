import bcrypt from "bcryptjs";
import { escapeLike } from "@/lib/like";
import { getDb } from "@/lib/supabase";

type UserAccountRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  role_id: number;
  is_suspended: boolean;
  created_at: string;
  role: { name: string; is_suspended: boolean };
};

const COLUMNS =
  "id, name, email, phone, password_hash, role_id, is_suspended, created_at, role(name, is_suspended)";

export class UserAccount {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public phone: string | null,
    public roleId: number,
    public roleName: string,
    public isSuspended: boolean,
    public isRoleSuspended: boolean,
    public createdAt: Date,
    private passwordHash: string,
  ) {}

  static async create(
    name: string,
    email: string,
    phone: string | null,
    password: string,
    roleId: number,
  ): Promise<UserAccount> {
    const passwordHash = await bcrypt.hash(password, 10);
    const { data, error } = await getDb()
      .from("user_account")
      .insert({ name, email: email.toLowerCase(), phone, password_hash: passwordHash, role_id: roleId })
      .select(COLUMNS)
      .single<UserAccountRow>();
    if (error) throw new Error(`UserAccount.create failed: ${error.message}`);
    return UserAccount.fromRow(data);
  }

  static async findAll(): Promise<UserAccount[]> {
    const { data, error } = await getDb()
      .from("user_account")
      .select(COLUMNS)
      .order("name")
      .returns<UserAccountRow[]>();
    if (error) throw new Error(`UserAccount.findAll failed: ${error.message}`);
    return data.map(UserAccount.fromRow);
  }

  static async findById(id: number): Promise<UserAccount | null> {
    const { data, error } = await getDb()
      .from("user_account")
      .select(COLUMNS)
      .eq("id", id)
      .maybeSingle<UserAccountRow>();
    if (error) throw new Error(`UserAccount.findById failed: ${error.message}`);
    return data ? UserAccount.fromRow(data) : null;
  }

  static async findByEmail(email: string): Promise<UserAccount | null> {
    const { data, error } = await getDb()
      .from("user_account")
      .select(COLUMNS)
      .eq("email", email.toLowerCase())
      .maybeSingle<UserAccountRow>();
    if (error) throw new Error(`UserAccount.findByEmail failed: ${error.message}`);
    return data ? UserAccount.fromRow(data) : null;
  }

  static async searchByEmail(email: string): Promise<UserAccount[]> {
    const { data, error } = await getDb()
      .from("user_account")
      .select(COLUMNS)
      .ilike("email", `%${escapeLike(email)}%`)
      .order("email")
      .returns<UserAccountRow[]>();
    if (error) throw new Error(`UserAccount.searchByEmail failed: ${error.message}`);
    return data.map(UserAccount.fromRow);
  }

  // Counts accounts created in [from, to), optionally only those with one role.
  static async countCreatedBetween(from: Date, to: Date, roleName?: string): Promise<number> {
    let query = getDb()
      .from("user_account")
      .select(roleName ? "id, role!inner(name)" : "id", { count: "exact", head: true })
      .gte("created_at", from.toISOString())
      .lt("created_at", to.toISOString());
    if (roleName) query = query.eq("role.name", roleName);
    const { count, error } = await query;
    if (error) throw new Error(`UserAccount.countCreatedBetween failed: ${error.message}`);
    return count ?? 0;
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  async update(name: string, email: string, phone: string | null, roleId: number): Promise<void> {
    const { error } = await getDb()
      .from("user_account")
      .update({ name, email: email.toLowerCase(), phone, role_id: roleId })
      .eq("id", this.id);
    if (error) throw new Error(`UserAccount.update failed: ${error.message}`);
    this.name = name;
    this.email = email.toLowerCase();
    this.phone = phone;
    this.roleId = roleId;
  }

  async setSuspended(isSuspended: boolean): Promise<void> {
    const { error } = await getDb()
      .from("user_account")
      .update({ is_suspended: isSuspended })
      .eq("id", this.id);
    if (error) throw new Error(`UserAccount.setSuspended failed: ${error.message}`);
    this.isSuspended = isSuspended;
  }

  async delete(): Promise<void> {
    const { error } = await getDb().from("user_account").delete().eq("id", this.id);
    if (error) throw new Error(`UserAccount.delete failed: ${error.message}`);
  }

  private static fromRow(row: UserAccountRow): UserAccount {
    return new UserAccount(
      row.id,
      row.name,
      row.email,
      row.phone,
      row.role_id,
      row.role.name,
      row.is_suspended,
      row.role.is_suspended,
      new Date(row.created_at),
      row.password_hash,
    );
  }
}
