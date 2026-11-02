import { escapeLike } from "@/lib/like";
import { getDb } from "@/lib/supabase";

type RoleRow = {
  id: number;
  name: string;
  description: string;
  is_suspended: boolean;
};

export class Role {
  constructor(
    public readonly id: number,
    public name: string,
    public description: string,
    public isSuspended: boolean,
  ) {}

  static async create(name: string, description: string): Promise<Role> {
    const { data, error } = await getDb()
      .from("role")
      .insert({ name, description })
      .select()
      .single();
    if (error) throw new Error(`Role.create failed: ${error.message}`);
    return Role.fromRow(data);
  }

  static async findAll(): Promise<Role[]> {
    const { data, error } = await getDb().from("role").select().order("name");
    if (error) throw new Error(`Role.findAll failed: ${error.message}`);
    return data.map(Role.fromRow);
  }

  static async findById(id: number): Promise<Role | null> {
    const { data, error } = await getDb().from("role").select().eq("id", id).maybeSingle();
    if (error) throw new Error(`Role.findById failed: ${error.message}`);
    return data ? Role.fromRow(data) : null;
  }

  static async findByName(name: string): Promise<Role | null> {
    const { data, error } = await getDb()
      .from("role")
      .select()
      .ilike("name", escapeLike(name))
      .maybeSingle();
    if (error) throw new Error(`Role.findByName failed: ${error.message}`);
    return data ? Role.fromRow(data) : null;
  }

  static async searchByName(name: string): Promise<Role[]> {
    const { data, error } = await getDb()
      .from("role")
      .select()
      .ilike("name", `%${escapeLike(name)}%`)
      .order("name");
    if (error) throw new Error(`Role.searchByName failed: ${error.message}`);
    return data.map(Role.fromRow);
  }

  async update(name: string, description: string): Promise<void> {
    const { error } = await getDb().from("role").update({ name, description }).eq("id", this.id);
    if (error) throw new Error(`Role.update failed: ${error.message}`);
    this.name = name;
    this.description = description;
  }

  async setSuspended(isSuspended: boolean): Promise<void> {
    const { error } = await getDb().from("role").update({ is_suspended: isSuspended }).eq("id", this.id);
    if (error) throw new Error(`Role.setSuspended failed: ${error.message}`);
    this.isSuspended = isSuspended;
  }

  private static fromRow(row: RoleRow): Role {
    return new Role(row.id, row.name, row.description, row.is_suspended);
  }
}
