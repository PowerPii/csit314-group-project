import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/entity/Project";
import { priceRange } from "../format";

// One project in a grid of results (browse, search, filter, favourites).
export function ProjectCard({ project, children }: { project: Project; children?: ReactNode }) {
  return (
    <article className="flex flex-col overflow-hidden rounded border">
      <Link href={`/customer/projects/${project.id}`}>
        {project.imageUrls[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrls[0]} alt="" className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 items-center justify-center bg-gray-100 text-sm text-gray-500 dark:bg-gray-800">No photos yet</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3 text-sm">
        <Link href={`/customer/projects/${project.id}`} className="font-semibold underline">{project.title}</Link>
        <span>{project.categoryName ?? "Uncategorised"}</span>
        <span>{priceRange(project.priceMin, project.priceMax)}</span>
        {project.styleTags.length > 0 && <span className="text-gray-500">{project.styleTags.join(" · ")}</span>}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </article>
  );
}

export function ProjectGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}
