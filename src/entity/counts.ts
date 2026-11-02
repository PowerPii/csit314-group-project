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

// Rows of `table` whose `column` timestamp is in [from, to).
export async function countBetween(table: "favourite" | "project_view", column: string, from: Date, to: Date): Promise<number> {
  const { count, error } = await getDb()
    .from(table)
    .select("id", { count: "exact", head: true })
    .gte(column, from.toISOString())
    .lt(column, to.toISOString());
  if (error) throw new Error(`Counting ${table} failed: ${error.message}`);
  return count ?? 0;
}

// Calls one of the "top N" report functions (see the report_functions migration).
export async function topRows<T>(fn: string, from: Date, to: Date, limit: number): Promise<T[]> {
  const { data, error } = await getDb().rpc(fn, {
    from_ts: from.toISOString(),
    to_ts: to.toISOString(),
    max_rows: limit,
  });
  if (error) throw new Error(`${fn} failed: ${error.message}`);
  return data as T[];
}
