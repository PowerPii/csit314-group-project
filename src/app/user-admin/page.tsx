import Link from "next/link";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";

export default async function UserAdminHomeBoundary() {
  const session = await requireRole("User Admin");

  return (
    <>
      <ActorHeader title="User Admin" name={session.name} />
      <main className="p-6">
        <ul className="list-disc pl-6">
          <li><Link href="/user-admin/roles/new" className="underline">Create role</Link></li>
        </ul>
      </main>
    </>
  );
}
