import { escapeLike } from "@/lib/like";
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

  static async create(name: string, description: string): Promise<Category> {
    const { data, error } = await getDb().from("category").insert({ name, description }).select().single();
    if (error) throw new Error(`Category.create failed: ${error.message}`);
    return Category.fromRow(data);
  }

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

  // Case-insensitive exact match, used to stop duplicate names.
  static async findByName(name: string): Promise<Category | null> {
    const { data, error } = await getDb()
      .from("category")
      .select()
      .ilike("name", escapeLike(name))
      .maybeSingle();
    if (error) throw new Error(`Category.findByName failed: ${error.message}`);
    return data ? Category.fromRow(data) : null;
  }

  // Categories whose name or description contains the keyword.
  static async searchByName(keyword: string): Promise<Category[]> {
    // Quote the pattern so commas or brackets in the keyword cannot break the or() filter.
    const pattern = `"%${escapeLike(keyword).replace(/["\\]/g, "\\$&")}%"`;
    const { data, error } = await getDb()
      .from("category")
      .select()
      .or(`name.ilike.${pattern},description.ilike.${pattern}`)
      .order("name");
    if (error) throw new Error(`Category.searchByName failed: ${error.message}`);
    return data.map(Category.fromRow);
  }

  async update(name: string, description: string): Promise<void> {
    const { error } = await getDb().from("category").update({ name, description }).eq("id", this.id);
    if (error) throw new Error(`Category.update failed: ${error.message}`);
    this.name = name;
    this.description = description;
  }

  async delete(): Promise<void> {
    const { error } = await getDb().from("category").delete().eq("id", this.id);
    if (error) throw new Error(`Category.delete failed: ${error.message}`);
  }

  private static fromRow(row: CategoryRow): Category {
    return new Category(row.id, row.name, row.description, row.is_suspended);
  }
}
