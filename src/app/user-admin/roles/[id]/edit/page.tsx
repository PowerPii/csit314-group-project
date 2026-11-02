import { notFound } from "next/navigation";
import { UpdateRoleController } from "@/control/UpdateRoleController";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../../ActorHeader";
import { USER_ADMIN_NAV } from "../../../nav";
import { updateRoleAction } from "./actions";
import { UpdateRoleForm } from "./UpdateRoleForm";

// UpdateRoleBoundary (UA #12)
export default async function UpdateRoleBoundary({ params }: PageProps<"/user-admin/roles/[id]/edit">) {
  const session = await requireRole("User Admin");
  const id = Number((await params).id);
  const role = await new UpdateRoleController().getRole(id);
  if (!role) notFound();

  return (
    <>
      <ActorHeader title={`Edit role: ${role.name}`} name={session.name} nav={USER_ADMIN_NAV} />
      <main className="p-6 sm:p-10">
        <UpdateRoleForm action={updateRoleAction.bind(null, id)} role={{ name: role.name, description: role.description }} />
      </main>
    </>
  );
}
