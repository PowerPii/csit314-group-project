import Link from "next/link";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";
import { USER_ADMIN_NAV } from "./nav";

export default async function UserAdminHomeBoundary() {
  const session = await requireRole("User Admin");

  return (
    <>
      <ActorHeader title="User Admin" name={session.name} nav={USER_ADMIN_NAV} />
      <main className="p-6">
        <ul className="list-disc pl-6">
          {USER_ADMIN_NAV.slice(1).map((item) => (
            <li key={item.href}><Link href={item.href} className="underline">{item.label}</Link></li>
          ))}
        </ul>
      </main>
    </>
  );
}
