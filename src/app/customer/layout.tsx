import { ActorShell } from "../shell/ActorShell";
import { CUSTOMER_NAV } from "./nav";

// Sidebar frame around every Customer page.
export default function CustomerLayout({ children }: LayoutProps<"/customer">) {
  return (
    <ActorShell actor="Customer" nav={CUSTOMER_NAV}>
      {children}
    </ActorShell>
  );
}
