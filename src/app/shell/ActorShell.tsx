import Link from "next/link";
import type { ReactNode } from "react";
import { getSession } from "@/lib/session";
import { LogoutButton } from "../logout/LogoutButton";
import { Brand } from "./Brand";
import { NavLinks, type NavItem } from "./NavLinks";

// Page frame for every actor area: dark sidebar (brand, nav, signed-in user, Log out) beside the page.
// Each page still checks its own role with requireRole; this only reads the name to show.
export async function ActorShell({ actor, nav, children }: { actor: string; nav: NavItem[]; children: ReactNode }) {
  const session = await getSession();

  return (
    <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
      <aside className="hidden bg-sidebar p-6 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <Link href={nav[0].href} className="mb-10">
          <Brand tone="light" />
        </Link>
        <NavLinks nav={nav} variant="sidebar" />
        <div className="mt-auto rounded-2xl bg-white/5 p-4">
          <p className="text-sm font-medium">{session.name}</p>
          <p className="mt-1 text-xs text-white/45">{actor}</p>
          <LogoutButton className="mt-4 text-xs font-semibold text-[#dc9b79] hover:text-white" />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
