import type { ReactNode } from "react";
import { ui } from "../../ui";

// Pieces shared by the three report pages.
export function StatGrid({ stats }: { stats: { label: string; value: number; previous?: number }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded border p-4">
          <dt className="text-sm">{s.label}</dt>
          <dd className="text-3xl font-semibold">{s.value}</dd>
          {s.previous !== undefined && <dd className="text-xs text-gray-500">{change(s.value, s.previous)}</dd>}
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
      <h2 className="mb-2 font-semibold">{title}</h2>
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
    <form className="flex flex-wrap items-end gap-3">
      {children}
      <button type="submit" className={ui.button}>Generate</button>
    </form>
  );
}
