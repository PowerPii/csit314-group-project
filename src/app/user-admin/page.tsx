import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";
import { ActorHome } from "../shell/ActorHome";
import { USER_ADMIN_NAV } from "./nav";

export default async function UserAdminHomeBoundary() {
  const session = await requireRole("User Admin");

  return (
    <>
      <ActorHeader title="Overview" name={session.name} nav={USER_ADMIN_NAV} />
      <ActorHome eyebrow="User administration" name={session.name} nav={USER_ADMIN_NAV.slice(1)} />
    </>
  );
}
