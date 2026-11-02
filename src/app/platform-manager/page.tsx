import Link from "next/link";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";
import { MANAGER_NAV } from "./nav";

export default async function PlatformManagerHomeBoundary() {
  const session = await requireRole("Platform Manager");

  return (
    <>
      <ActorHeader title="Platform Manager" name={session.name} nav={MANAGER_NAV} />
      <main className="p-6">
        <ul className="list-disc pl-6">
          {MANAGER_NAV.slice(1).map((item) => (
            <li key={item.href}><Link href={item.href} className="underline">{item.label}</Link></li>
          ))}
        </ul>
      </main>
    </>
  );
}
