// Display helpers shared by pages.
const money = new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD", maximumFractionDigits: 0 });

export function priceRange(min: number | null, max: number | null): string {
  if (min === null && max === null) return "Price on request";
  if (min !== null && max !== null) return `${money.format(min)} – ${money.format(max)}`;
  return min !== null ? `From ${money.format(min)}` : `Up to ${money.format(max!)}`;
}

export function shortDate(date: Date | null): string {
  return date ? date.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" }) : "";
}

// Days between two dates, rounded up (used for "completed in N days").
export function daysBetween(from: Date, to: Date): number {
  return Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)));
}
