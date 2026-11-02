import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { MANAGER_NAV } from "../../nav";
import { CategoryForm } from "../CategoryForm";
import { createCategoryAction } from "./actions";

// CreateCategoryBoundary (PM #3)
export default async function CreateCategoryBoundary() {
  const session = await requireRole("Platform Manager");

  return (
    <>
      <ActorHeader title="New category" name={session.name} nav={MANAGER_NAV} />
      <main className="p-6 sm:p-10">
        <CategoryForm action={createCategoryAction} submitLabel="Create category" clearOnSuccess />
      </main>
    </>
  );
}
