// Shared Tailwind classes so every page looks the same (Hausfolk theme from the Figma design).
export const ui = {
  input:
    "rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-normal text-ink outline-none transition placeholder:text-[#a6aaa6] focus:border-accent focus:ring-4 focus:ring-accent/10",
  button:
    "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:opacity-60",
  secondaryButton:
    "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/40",
  smallButton:
    "inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink transition hover:border-ink/40 disabled:opacity-60",
  dangerButton:
    "inline-flex items-center rounded-full border border-[#e8c4b8] bg-white px-3 py-1 text-xs font-medium text-danger transition hover:bg-danger-soft disabled:opacity-60",
  link: "font-medium text-accent underline-offset-4 hover:underline",
  table:
    "w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-line bg-white text-left text-sm [&_tbody_tr:last-child_td]:border-b-0",
  th: "border-b border-line bg-panel px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted",
  td: "border-b border-line-soft px-4 py-3 align-top",
  error: "rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger",
  success: "rounded-xl bg-success-soft px-4 py-3 text-sm text-success",
  card: "rounded-2xl border border-line bg-white p-6",
  eyebrow: "text-xs font-semibold uppercase tracking-[0.16em] text-accent",
  heading: "font-serif text-2xl tracking-tight",
  pill: "inline-block w-fit rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success",
  mutedPill: "inline-block w-fit rounded-full bg-[#ece8df] px-3 py-1 text-xs font-medium text-muted",
};

// What a server action sends back to the form or button that called it.
export type ActionState = { error?: string; message?: string };
