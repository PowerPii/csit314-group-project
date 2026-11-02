import Link from "next/link";
import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";
import { DESIGNER_NAV } from "./nav";

export default async function DesignerHomeBoundary() {
  const session = await requireRole("Interior Designer");

  return (
    <>
      <ActorHeader title="Interior Designer" name={session.name} nav={DESIGNER_NAV} />
      <main className="p-6">
        <ul className="list-disc pl-6">
          {DESIGNER_NAV.slice(1).map((item) => (
            <li key={item.href}><Link href={item.href} className="underline">{item.label}</Link></li>
          ))}
        </ul>
      </main>
    </>
  );
}
