import { ViewRolesController } from "@/control/ViewRolesController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { USER_ADMIN_NAV } from "../../nav";
import { CreateUserAccountForm } from "./CreateUserAccountForm";

// CreateUserAccountBoundary (UA #3). The role list comes from ViewRolesController (UA #11).
export default async function CreateUserAccountBoundary() {
  const session = await requireRole("User Admin");
  const roles = await new ViewRolesController().viewRoles();

  return (
    <>
      <ActorHeader title="Create account" name={session.name} nav={USER_ADMIN_NAV} />
      <main className="p-6 sm:p-10">
        <CreateUserAccountForm roles={roles.map((r) => ({ id: r.id, name: r.name }))} />
      </main>
    </>
  );
}
