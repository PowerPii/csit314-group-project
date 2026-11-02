import { notFound } from "next/navigation";
import { UpdateCategoryController } from "@/control/UpdateCategoryController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../../ActorHeader";
import { MANAGER_NAV } from "../../../nav";
import { CategoryForm } from "../../CategoryForm";
import { updateCategoryAction } from "./actions";

// UpdateCategoryBoundary (PM #5)
export default async function UpdateCategoryBoundary({ params }: PageProps<"/platform-manager/categories/[id]/edit">) {
  const session = await requireRole("Platform Manager");
  const id = Number((await params).id);
  const category = await new UpdateCategoryController().getCategory(id);
  if (!category) notFound();

  return (
    <>
      <ActorHeader title={`Edit category: ${category.name}`} name={session.name} nav={MANAGER_NAV} />
      <main className="p-6 sm:p-10">
        <CategoryForm
          action={updateCategoryAction.bind(null, id)}
          initial={{ name: category.name, description: category.description }}
          submitLabel="Save changes"
        />
      </main>
    </>
  );
}
