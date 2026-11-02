// The Hausfolk logo mark and name. "light" is for the dark sidebar and the photo panel.
export function Brand({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-3">
      <span
        className={`grid size-9 place-items-center rounded-full text-sm font-semibold text-white ${
          tone === "light" ? "bg-[#bd7653]" : "bg-accent"
        }`}
      >
        H
      </span>
      <span className={`text-lg font-semibold tracking-tight ${tone === "light" ? "text-white" : "text-ink"}`}>
        Hausfolk
      </span>
    </span>
  );
}
