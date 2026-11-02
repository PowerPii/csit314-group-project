import { ViewCategoriesController } from "@/control/ViewCategoriesController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { DESIGNER_NAV } from "../../nav";
import { ProjectForm } from "../ProjectForm";
import { createProjectAction } from "./actions";

// CreateProjectBoundary (ID #6). Categories for the drop-down come from ViewCategoriesController.
export default async function CreateProjectBoundary() {
  const session = await requireRole("Interior Designer");
  const categories = await new ViewCategoriesController().viewCategories();

  return (
    <>
      <ActorHeader title="New project" name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6 sm:p-10">
        <ProjectForm
          action={createProjectAction}
          categories={categories.filter((c) => !c.isSuspended).map((c) => ({ id: c.id, name: c.name }))}
          submitLabel="Create project"
        />
      </main>
    </>
  );
}
