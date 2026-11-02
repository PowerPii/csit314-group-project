import Link from "next/link";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";
import { CUSTOMER_NAV } from "./nav";

export default async function CustomerHomeBoundary() {
  const session = await requireRole("Customer");

  return (
    <>
      <ActorHeader title="Customer" name={session.name} nav={CUSTOMER_NAV} />
      <main className="p-6">
        <ul className="list-disc pl-6">
          {CUSTOMER_NAV.slice(1).map((item) => (
            <li key={item.href}><Link href={item.href} className="underline">{item.label}</Link></li>
          ))}
        </ul>
      </main>
    </>
  );
}
