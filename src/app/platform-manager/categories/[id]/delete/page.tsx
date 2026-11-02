import { notFound } from "next/navigation";
import { DeleteCategoryController } from "@/control/DeleteCategoryController";
import { ViewCategoriesController } from "@/control/ViewCategoriesController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../../ActorHeader";
import { MANAGER_NAV } from "../../../nav";
import { deleteCategoryAction } from "./actions";
import { DeleteCategoryForm } from "./DeleteCategoryForm";

// DeleteCategoryBoundary (PM #6): pick where its projects go, then delete.
export default async function DeleteCategoryBoundary({ params }: PageProps<"/platform-manager/categories/[id]/delete">) {
  const session = await requireRole("Platform Manager");
  const id = Number((await params).id);
  const [info, all] = await Promise.all([
    new DeleteCategoryController().getDeleteInfo(id),
    new ViewCategoriesController().viewCategories(),
  ]);
  if (!info) notFound();

  return (
    <>
      <ActorHeader title={`Delete category: ${info.category.name}`} name={session.name} nav={MANAGER_NAV} />
      <main className="p-6 sm:p-10">
        <DeleteCategoryForm
          action={deleteCategoryAction.bind(null, id)}
          projectCount={info.projectCount}
          others={all.filter((c) => c.id !== id).map((c) => ({ id: c.id, name: c.name }))}
        />
      </main>
    </>
  );
}
