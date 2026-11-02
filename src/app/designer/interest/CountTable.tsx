import type { ProjectWithCount } from "@/control/projectCounts";
import { ui } from "../../ui";

export function CountTable({ rows, label }: { rows: ProjectWithCount[]; label: string }) {
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  return (
    <>
      <p className="mb-2 text-sm">{total} {label.toLowerCase()} across {rows.length} project(s).</p>
      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Project</th>
            <th className={ui.th}>Status</th>
            <th className={ui.th}>{label}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ project, count }) => (
            <tr key={project.id}>
              <td className={ui.td}>{project.title}</td>
              <td className={ui.td}>{project.status === "current" ? "Current" : "Completed"}</td>
              <td className={ui.td}>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
