import { notFound } from "next/navigation";
import { UpdateUserAccountController } from "@/control/UpdateUserAccountController";
import { ViewRolesController } from "@/control/ViewRolesController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../../ActorHeader";
import { USER_ADMIN_NAV } from "../../../nav";
import { updateUserAccountAction } from "./actions";
import { UpdateUserAccountForm } from "./UpdateUserAccountForm";

// UpdateUserAccountBoundary (UA #5)
export default async function UpdateUserAccountBoundary({ params }: PageProps<"/user-admin/accounts/[id]/edit">) {
  const session = await requireRole("User Admin");
  const id = Number((await params).id);
  const [account, roles] = await Promise.all([
    new UpdateUserAccountController().getUserAccount(id),
    new ViewRolesController().viewRoles(),
  ]);
  if (!account) notFound();

  return (
    <>
      <ActorHeader title={`Edit account: ${account.email}`} name={session.name} nav={USER_ADMIN_NAV} />
      <main className="p-6">
        <UpdateUserAccountForm
          action={updateUserAccountAction.bind(null, id)}
          account={{ name: account.name, email: account.email, phone: account.phone ?? "", roleId: account.roleId }}
          roles={roles.map((r) => ({ id: r.id, name: r.name }))}
        />
      </main>
    </>
  );
}
