import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/entity/Project";
import { priceRange } from "../format";

// One project in a grid of results (browse, search, filter, favourites).
export function ProjectCard({ project, children }: { project: Project; children?: ReactNode }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-white transition hover:shadow-md">
      <Link href={`/customer/projects/${project.id}`}>
        {project.imageUrls[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.imageUrls[0]} alt="" className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-48 items-center justify-center bg-[#ece8df] text-sm text-muted">No photos yet</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4 text-sm">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-eyebrow">{project.categoryName ?? "Uncategorised"}</span>
        <Link href={`/customer/projects/${project.id}`} className="font-serif text-lg leading-snug tracking-tight hover:text-accent">{project.title}</Link>
        <span className="font-medium">{priceRange(project.priceMin, project.priceMax)}</span>
        {project.styleTags.length > 0 && <span className="text-muted">{project.styleTags.join(" · ")}</span>}
        {children && <div className="mt-auto pt-3">{children}</div>}
      </div>
    </article>
  );
}

export function ProjectGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}
