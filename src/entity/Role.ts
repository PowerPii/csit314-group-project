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

  static async findByName(name: string): Promise<Role | null> {
    const { data, error } = await getDb()
      .from("role")
      .select()
      .ilike("name", name)
      .maybeSingle();
    if (error) throw new Error(`Role.findByName failed: ${error.message}`);
    return data ? Role.fromRow(data) : null;
  }

  private static fromRow(row: RoleRow): Role {
    return new Role(row.id, row.name, row.description, row.is_suspended);
  }
}
