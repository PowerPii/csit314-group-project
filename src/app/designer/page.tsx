import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";
import { ActorHome } from "../shell/ActorHome";
import { DESIGNER_NAV } from "./nav";

export default async function DesignerHomeBoundary() {
  const session = await requireRole("Interior Designer");

  return (
    <>
      <ActorHeader title="Overview" name={session.name} nav={DESIGNER_NAV} />
      <ActorHome eyebrow="Your studio" name={session.name} nav={DESIGNER_NAV.slice(1)} />
    </>
  );
}
