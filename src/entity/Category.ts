import { getDb } from "@/lib/supabase";

type CategoryRow = {
  id: number;
  name: string;
  description: string;
  is_suspended: boolean;
};

export class Category {
  constructor(
    public readonly id: number,
    public name: string,
    public description: string,
    public isSuspended: boolean,
  ) {}

  static async findAll(): Promise<Category[]> {
    const { data, error } = await getDb().from("category").select().order("name");
    if (error) throw new Error(`Category.findAll failed: ${error.message}`);
    return data.map(Category.fromRow);
  }

  static async findById(id: number): Promise<Category | null> {
    const { data, error } = await getDb().from("category").select().eq("id", id).maybeSingle();
    if (error) throw new Error(`Category.findById failed: ${error.message}`);
    return data ? Category.fromRow(data) : null;
  }

  private static fromRow(row: CategoryRow): Category {
    return new Category(row.id, row.name, row.description, row.is_suspended);
  }
}
