import Link from "next/link";
import type { Project } from "@/entity/Project";
import { ActionButton } from "../../ActionButton";
import { ui } from "../../ui";
import { deleteProjectAction, markProjectCompletedAction } from "./actions";

// Edit / Mark completed / Delete buttons for one of the designer's projects.
export function ProjectRowActions({ project }: { project: Project }) {
  return (
    <>
      <Link href={`/designer/projects/${project.id}/edit`} className={ui.smallButton}>Edit</Link>
      {project.status === "current" && (
        <ActionButton
          action={markProjectCompletedAction.bind(null, project.id)}
          label="Mark completed"
          confirmText={`Mark "${project.title}" as completed? It moves to Past projects.`}
          className={ui.smallButton}
        />
      )}
      <ActionButton
        action={deleteProjectAction.bind(null, project.id)}
        label="Delete"
        confirmText={`Delete "${project.title}"? This cannot be undone.`}
        className={ui.dangerButton}
      />
    </>
  );
}
