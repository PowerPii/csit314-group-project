import { notFound } from "next/navigation";
import { UpdateProjectController } from "@/control/UpdateProjectController";
import { ViewCategoriesController } from "@/control/ViewCategoriesController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../../ActorHeader";
import { DESIGNER_NAV } from "../../../nav";
import { ProjectForm } from "../../ProjectForm";
import { updateProjectAction } from "./actions";

// UpdateProjectBoundary (ID #8)
export default async function UpdateProjectBoundary({ params }: PageProps<"/designer/projects/[id]/edit">) {
  const session = await requireRole("Interior Designer");
  const id = Number((await params).id);
  const [project, categories] = await Promise.all([
    new UpdateProjectController().getProject(session.userAccountId!, id),
    new ViewCategoriesController().viewCategories(),
  ]);
  if (!project) notFound();

  return (
    <>
      <ActorHeader title={`Edit project: ${project.title}`} name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6">
        <ProjectForm
          action={updateProjectAction.bind(null, id)}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          images={project.imageUrls}
          submitLabel="Save changes"
          initial={{
            title: project.title,
            description: project.description,
            categoryId: String(project.categoryId ?? ""),
            styleTags: project.styleTags.join(", "),
            priceMin: project.priceMin === null ? "" : String(project.priceMin),
            priceMax: project.priceMax === null ? "" : String(project.priceMax),
          }}
        />
      </main>
    </>
  );
}
