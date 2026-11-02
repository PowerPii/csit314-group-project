import Link from "next/link";
import { NavIcon, type NavItem } from "./NavLinks";

// Body of each actor's home page: a greeting and a card for each of the actor's pages.
export function ActorHome({ eyebrow, name, nav }: { eyebrow: string; name?: string; nav: NavItem[] }) {
  const first = name?.split(/\s+/)[0];
  return (
    <main className="p-6 sm:p-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
      <h2 className="mb-8 font-serif text-4xl tracking-tight">{first ? `Welcome back, ${first}.` : "Welcome back."}</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col rounded-2xl border bg-white p-5 transition hover:border-accent/40 hover:shadow-sm"
          >
            <span className="mb-4 grid size-11 place-items-center rounded-full bg-[#f1e8df] text-accent">
              <NavIcon label={item.label} />
            </span>
            <span className="font-serif text-xl tracking-tight">{item.label}</span>
            {item.hint && <span className="mt-1 text-sm leading-6 text-muted">{item.hint}</span>}
            <span className="mt-4 text-sm font-semibold text-accent">
              Open <span className="inline-block transition group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
