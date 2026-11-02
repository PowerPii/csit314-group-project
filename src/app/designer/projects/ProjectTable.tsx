import type { ReactNode } from "react";
import type { Project } from "@/entity/Project";
import { priceRange, shortDate } from "../../format";
import { ui } from "../../ui";

// A designer's projects as a table. `actions` renders the buttons for each row.
export function ProjectTable({
  projects,
  showCompleted = false,
  extraColumn,
  actions,
}: {
  projects: Project[];
  showCompleted?: boolean;
  extraColumn?: { label: string; value: (p: Project) => ReactNode };
  actions?: (p: Project) => ReactNode;
}) {
  return (
    <table className={ui.table}>
      <thead>
        <tr>
          <th className={ui.th}>Title</th>
          <th className={ui.th}>Category</th>
          <th className={ui.th}>Styles</th>
          <th className={ui.th}>Price</th>
          <th className={ui.th}>{showCompleted ? "Completed" : "Created"}</th>
          {extraColumn && <th className={ui.th}>{extraColumn.label}</th>}
          {actions && <th className={ui.th}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id}>
            <td className={ui.td}>{p.title}</td>
            <td className={ui.td}>{p.categoryName ?? ""}</td>
            <td className={ui.td}>{p.styleTags.join(", ")}</td>
            <td className={ui.td}>{priceRange(p.priceMin, p.priceMax)}</td>
            <td className={ui.td}>{shortDate(showCompleted ? p.completedAt : p.createdAt)}</td>
            {extraColumn && <td className={ui.td}>{extraColumn.value(p)}</td>}
            {actions && (
              <td className={ui.td}>
                <div className="flex flex-wrap items-start gap-2">{actions(p)}</div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
