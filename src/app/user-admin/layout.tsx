import { ActorShell } from "../shell/ActorShell";
import { USER_ADMIN_NAV } from "./nav";

// Sidebar frame around every User Admin page.
export default function UserAdminLayout({ children }: LayoutProps<"/user-admin">) {
  return (
    <ActorShell actor="User Admin" nav={USER_ADMIN_NAV}>
      {children}
    </ActorShell>
  );
}
