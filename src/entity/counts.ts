import { getDb } from "@/lib/supabase";

// Counts rows of `table` per project_id, for the given projects. Projects with no rows are left out.
export async function countPerProject(table: "favourite" | "project_view", projectIds: number[]): Promise<Map<number, number>> {
  const counts = new Map<number, number>();
  if (projectIds.length === 0) return counts;

  // PostgREST has no GROUP BY, so fetch the project_id column in pages and count here.
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await getDb()
      .from(table)
      .select("project_id")
      .in("project_id", projectIds)
      .order("id")
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Counting ${table} failed: ${error.message}`);
    for (const row of data) counts.set(row.project_id, (counts.get(row.project_id) ?? 0) + 1);
    if (data.length < pageSize) break;
  }
  return counts;
}
