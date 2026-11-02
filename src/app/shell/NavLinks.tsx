"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; hint?: string };

// The nav item for the current page: the longest href the path starts with.
function activeHref(pathname: string, nav: NavItem[]) {
  return nav
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

// Line icons (24px grid), picked from the link's label.
const ICONS: [RegExp, string][] = [
  [/home/i, "M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-3H4v3Zm10-13h6V4h-6v3Z"],
  [/search|browse/i, "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4"],
  [/new|create/i, "M12 5v14M5 12h14"],
  [/favourite|shortlist/i, "M6 4h12v16l-6-4-6 4V4Z"],
  [/report/i, "M5 19V9m7 10V5m7 14v-7"],
  [/views/i, "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
  [/past/i, "M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"],
  [/compan|profile/i, "M4 20V8l8-4 8 4v12M9 20v-6h6v6"],
  [/account/i, "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"],
  [/role/i, "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"],
  [/categor/i, "M4 4h7l9 9-7 7-9-9V4Zm4 4h.01"],
  [/project/i, "M4 7h16v13H4V7Zm4 0V4h8v3"],
];

export function NavIcon({ label }: { label: string }) {
  const path = ICONS.find(([re]) => re.test(label))?.[1] ?? ICONS[0][1];
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0 fill-none stroke-current">
      <path d={path} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Sidebar links on wide screens; a scrolling row of pills on phones.
export function NavLinks({ nav, variant }: { nav: NavItem[]; variant: "sidebar" | "bar" }) {
  const current = activeHref(usePathname(), nav);

  if (variant === "bar") {
    return (
      <nav className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 text-sm">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.href === current ? "page" : undefined}
            className={`shrink-0 rounded-full px-3 py-1.5 font-medium transition ${
              item.href === current ? "bg-ink text-white" : "border border-line bg-white text-muted"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.href === current ? "page" : undefined}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
            item.href === current ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
          }`}
        >
          <NavIcon label={item.label} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
