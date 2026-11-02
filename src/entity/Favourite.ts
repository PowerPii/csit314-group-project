import { escapeLike } from "@/lib/like";
import { getDb } from "@/lib/supabase";
import { countPerProject } from "./counts";
import { Project, type ProjectRow } from "./Project";

type FavouriteRow = { id: number; customer_id: number; project_id: number; created_at: string };

const PROJECT_COLUMNS = "created_at, project!inner(*, category(name))";

// One project saved to one customer's favourite list (a "shortlist").
export class Favourite {
  constructor(
    public readonly id: number,
    public readonly customerId: number,
    public readonly projectId: number,
    public readonly createdAt: Date,
  ) {}

  static async create(customerId: number, projectId: number): Promise<Favourite> {
    const { data, error } = await getDb()
      .from("favourite")
      .insert({ customer_id: customerId, project_id: projectId })
      .select()
      .single<FavouriteRow>();
    if (error) throw new Error(`Favourite.create failed: ${error.message}`);
    return new Favourite(data.id, data.customer_id, data.project_id, new Date(data.created_at));
  }

  static async exists(customerId: number, projectId: number): Promise<boolean> {
    const { count, error } = await getDb()
      .from("favourite")
      .select("id", { count: "exact", head: true })
      .eq("customer_id", customerId)
      .eq("project_id", projectId);
    if (error) throw new Error(`Favourite.exists failed: ${error.message}`);
    return (count ?? 0) > 0;
  }

  // The customer's saved projects, most recently saved first.
  static async findProjectsByCustomer(customerId: number): Promise<Project[]> {
    return Favourite.searchProjectsByCustomer(customerId, "", null);
  }

  // The customer's saved projects whose title contains keyword and, if given, in one category.
  static async searchProjectsByCustomer(customerId: number, keyword: string, categoryId: number | null): Promise<Project[]> {
    let query = getDb().from("favourite").select(PROJECT_COLUMNS).eq("customer_id", customerId);
    if (keyword) query = query.ilike("project.title", `%${escapeLike(keyword)}%`);
    if (categoryId) query = query.eq("project.category_id", categoryId);
    const { data, error } = await query
      .order("created_at", { ascending: false })
      .returns<{ project: ProjectRow }[]>();
    if (error) throw new Error(`Favourite.searchProjectsByCustomer failed: ${error.message}`);
    return data.map((row) => Project.fromRow(row.project));
  }

  // Returns false when the project was not in the customer's favourites.
  static async remove(customerId: number, projectId: number): Promise<boolean> {
    const { data, error } = await getDb()
      .from("favourite")
      .delete()
      .eq("customer_id", customerId)
      .eq("project_id", projectId)
      .select("id");
    if (error) throw new Error(`Favourite.remove failed: ${error.message}`);
    return data.length > 0;
  }

  // Number of customers who saved each project, per project id.
  static async countByProjects(projectIds: number[]): Promise<Map<number, number>> {
    return countPerProject("favourite", projectIds);
  }
}
