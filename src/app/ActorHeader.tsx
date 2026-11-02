import Link from "next/link";
import { LogoutButton } from "./logout/LogoutButton";

// Top bar on every actor page: page title, links to the actor's main pages, name and Log out.
export function ActorHeader({
  title,
  name,
  nav = [],
}: {
  title: string;
  name?: string;
  nav?: { href: string; label: string }[];
}) {
  return (
    <header className="border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-4">
          {name && <span>{name}</span>}
          <LogoutButton />
        </div>
      </div>
      {nav.length > 0 && (
        <nav className="mt-2 flex flex-wrap gap-4 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="underline">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
