import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { USER_ADMIN_NAV } from "../../nav";
import { CreateRoleForm } from "./CreateRoleForm";

// CreateRoleBoundary (UA #10).
export default async function CreateRoleBoundary() {
  const session = await requireRole("User Admin");

  return (
    <>
      <ActorHeader title="Create role" name={session.name} nav={USER_ADMIN_NAV} />
      <main className="p-6 sm:p-10">
        <CreateRoleForm />
      </main>
    </>
  );
}
