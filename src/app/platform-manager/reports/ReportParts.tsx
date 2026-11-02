import type { ReactNode } from "react";
import type { Project } from "@/entity/Project";
import { shortDate } from "../../format";
import { ui } from "../../ui";

// Pieces shared by the three report pages.
export function StatGrid({ stats }: { stats: { label: string; value: number; previous?: number }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border bg-white p-5">
          <dt className="text-sm text-muted">{s.label}</dt>
          <dd className="mt-3 font-serif text-3xl">{s.value}</dd>
          {s.previous !== undefined && <dd className="text-xs text-muted">{change(s.value, s.previous)}</dd>}
        </div>
      ))}
    </dl>
  );
}

function change(value: number, previous: number): string {
  const diff = value - previous;
  const pct = previous === 0 ? "" : ` (${diff >= 0 ? "+" : ""}${Math.round((diff / previous) * 100)}%)`;
  return `${diff >= 0 ? "+" : ""}${diff} vs previous month${pct}`;
}

export function TopTable({ title, unit, rows }: { title: string; unit: string; rows: { key: number; name: string; count: number }[] }) {
  return (
    <section>
      <h2 className="mb-3 font-serif text-xl tracking-tight">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm">No activity.</p>
      ) : (
        <table className={ui.table}>
          <thead>
            <tr>
              <th className={ui.th}>#</th>
              <th className={ui.th}>Name</th>
              <th className={ui.th}>{unit}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.key}>
                <td className={ui.td}>{i + 1}</td>
                <td className={ui.td}>{r.name}</td>
                <td className={ui.td}>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export function PeriodForm({ children }: { children: ReactNode }) {
  return (
    <form className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4">
      {children}
      <button type="submit" className={ui.button}>Generate</button>
    </form>
  );
}

// PM #8: projects nobody opened that day. Grouped by category with a count each, so a long
// list stays readable; each group opens to show its projects.
export function NoViewsList({ projects }: { projects: Project[] }) {
  const groups = new Map<string, Project[]>();
  for (const p of projects) {
    const key = p.categoryName ?? "Uncategorised";
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

  return (
    <section className="rounded-2xl border bg-white">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-line-soft px-6 py-5">
        <div>
          <h2 className="font-serif text-xl tracking-tight">Projects with no views ({projects.length})</h2>
          <p className="mt-1 text-sm text-muted">
            {projects.length === 0
              ? "Every project was viewed at least once."
              : `Across ${sorted.length} categories. Open a category to see its projects.`}
          </p>
        </div>
      </div>
      {sorted.length > 0 && (
        <div className="max-h-[32rem] divide-y divide-line-soft overflow-y-auto">
          {sorted.map(([category, list]) => (
            <details key={category} className="group">
              <summary className="flex list-none items-center justify-between gap-4 px-6 py-3 text-sm hover:bg-panel [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 fill-none stroke-current text-muted transition group-open:rotate-90">
                    <path d="m8 5 5 5-5 5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {category}
                </span>
                <span className={ui.mutedPill}>{list.length}</span>
              </summary>
              <ul className="bg-panel/60 px-6 pb-3 pl-12 text-sm">
                {list.map((p) => (
                  <li key={p.id} className="flex justify-between gap-4 py-1.5">
                    <span>{p.title}</span>
                    <span className="shrink-0 text-xs text-faint">Added {shortDate(p.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
