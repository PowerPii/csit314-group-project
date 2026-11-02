import { ActorShell } from "../shell/ActorShell";
import { MANAGER_NAV } from "./nav";

// Sidebar frame around every Platform Manager page.
export default function PlatformManagerLayout({ children }: LayoutProps<"/platform-manager">) {
  return (
    <ActorShell actor="Platform Manager" nav={MANAGER_NAV}>
      {children}
    </ActorShell>
  );
}
