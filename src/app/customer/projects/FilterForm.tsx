"use client";

import type { ReactNode } from "react";

// The filter bar on the browse page. Choosing from a drop-down submits straight away,
// so the page reloads with the other drop-downs narrowed to what still has projects.
export function FilterForm({ children }: { children: ReactNode }) {
  return (
    <form
      onChange={(e) => {
        if ((e.target as HTMLElement).tagName === "SELECT") e.currentTarget.requestSubmit();
      }}
      className="flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4"
    >
      {children}
    </form>
  );
}
