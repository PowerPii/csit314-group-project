import Link from "next/link";
import { LogoutButton } from "./logout/LogoutButton";
import { Brand } from "./shell/Brand";
import { NavLinks, type NavItem } from "./shell/NavLinks";

// Top bar on every actor page: page title and the user's initials. On phones, where the
// sidebar is hidden, it also carries the logo, Log out and the actor's links.
export function ActorHeader({ title, name, nav = [] }: { title: string; name?: string; nav?: NavItem[] }) {
  const initials = (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <header className="border-b border-line bg-panel px-6 sm:px-10">
      <div className="flex items-center justify-between py-4 lg:hidden">
        <Link href={nav[0]?.href ?? "/"}>
          <Brand />
        </Link>
        <LogoutButton />
      </div>
      <div className="flex min-h-20 items-center justify-between gap-4 py-4">
        <div>
          <p className="text-xs font-medium text-muted">Workspace</p>
          <h1 className="font-serif text-2xl tracking-tight">{title}</h1>
        </div>
        {name && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:block">{name}</span>
            <span
              title={name}
              className="grid size-10 place-items-center rounded-full bg-[#d7c7b5] text-sm font-semibold text-[#5a4438]"
            >
              {initials}
            </span>
          </div>
        )}
      </div>
      {nav.length > 0 && (
        <div className="pb-4 lg:hidden">
          <NavLinks nav={nav} variant="bar" />
        </div>
      )}
    </header>
  );
}
