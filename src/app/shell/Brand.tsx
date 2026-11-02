// The Hausfolk logo: the two-houses mark ("haus" + "folk") and the serif wordmark.
// "light" is for the dark sidebar and the photo panel. The same mark is the favicon (src/app/icon.svg).
export function LogoMark({ tone = "dark", className = "size-9" }: { tone?: "dark" | "light"; className?: string }) {
  const light = tone === "light";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path fill={light ? "#f4f2ec" : "#202925"} d="M8 54V30l14-14 14 14v24Z" />
      <path fill={light ? "#bd7653" : "#a85f3b"} d="M28 54V30l14-14 14 14v24Z" />
      <path fill={light ? "#1d2722" : "#f4f2ec"} opacity=".9" d="m28 38 8-8v24h-8Z" />
    </svg>
  );
}

export function Brand({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-2.5" aria-label="Hausfolk">
      <LogoMark tone={tone} />
      <span
        className={`font-brand text-2xl font-medium tracking-tight ${tone === "light" ? "text-white" : "text-ink"}`}
      >
        Hausfolk
      </span>
    </span>
  );
}
