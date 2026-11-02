import type { Project } from "@/entity/Project";

export type ProjectWithCount = { project: Project; count: number };

// Pairs each project with its count (0 if missing), highest count first.
export function withCounts(projects: Project[], counts: Map<number, number>): ProjectWithCount[] {
  return projects
    .map((project) => ({ project, count: counts.get(project.id) ?? 0 }))
    .sort((a, b) => b.count - a.count);
}
