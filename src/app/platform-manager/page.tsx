import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";
import { ActorHome } from "../shell/ActorHome";
import { MANAGER_NAV } from "./nav";

export default async function PlatformManagerHomeBoundary() {
  const session = await requireRole("Platform Manager");

  return (
    <>
      <ActorHeader title="Overview" name={session.name} nav={MANAGER_NAV} />
      <ActorHome eyebrow="Platform pulse" name={session.name} nav={MANAGER_NAV.slice(1)} />
    </>
  );
}
