import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";
import { ActorHome } from "../shell/ActorHome";
import { CUSTOMER_NAV } from "./nav";

export default async function CustomerHomeBoundary() {
  const session = await requireRole("Customer");

  return (
    <>
      <ActorHeader title="Overview" name={session.name} nav={CUSTOMER_NAV} />
      <ActorHome eyebrow="Your inspiration" name={session.name} nav={CUSTOMER_NAV.slice(1)} />
    </>
  );
}
