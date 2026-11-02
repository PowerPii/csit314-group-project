import { ActorShell } from "../shell/ActorShell";
import { DESIGNER_NAV } from "./nav";

// Sidebar frame around every Interior Designer page.
export default function InteriorDesignerLayout({ children }: LayoutProps<"/designer">) {
  return (
    <ActorShell actor="Interior Designer" nav={DESIGNER_NAV}>
      {children}
    </ActorShell>
  );
}
