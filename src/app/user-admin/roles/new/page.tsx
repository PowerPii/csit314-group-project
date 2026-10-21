import { requireRole } from "@/lib/session";
import { ActorHeader } from "../../../ActorHeader";
import { CreateRoleForm } from "./CreateRoleForm";

// CreateRoleBoundary (UA #10).
export default async function CreateRoleBoundary() {
  const session = await requireRole("User Admin");

  return (
    <>
      <ActorHeader title="Create role" name={session.name} />
      <main className="p-6">
        <CreateRoleForm />
      </main>
    </>
  );
}
