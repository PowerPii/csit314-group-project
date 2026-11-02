// Report periods are calendar days, weeks and months in Singapore time (UTC+8, no daylight saving),
// whatever time zone the server runs in.
const SG_OFFSET = "+08:00";
const DAY = 24 * 60 * 60 * 1000;

export type Range = { from: Date; to: Date };

// "2026-11-02" -> midnight at the start of that day in Singapore. Null if not a real date.
export function parseSgDate(text: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const date = new Date(`${text}T00:00:00${SG_OFFSET}`);
  return Number.isNaN(date.getTime()) || sgDateString(date) !== text ? null : date;
}

// The Singapore calendar date of an instant, as YYYY-MM-DD.
export function sgDateString(date: Date): string {
  return new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function dayRange(day: Date): Range {
  return { from: day, to: new Date(day.getTime() + DAY) };
}

// The Monday-to-Sunday week containing `day`.
export function weekRange(day: Date): Range {
  const start = parseSgDate(sgDateString(day))!;
  const weekday = new Date(start.getTime() + 8 * 60 * 60 * 1000).getUTCDay(); // 0 = Sunday
  const monday = new Date(start.getTime() - ((weekday + 6) % 7) * DAY);
  return { from: monday, to: new Date(monday.getTime() + 7 * DAY) };
}

// "2026-10" -> 1 Oct to 1 Nov, plus the start of the month before. Null if not YYYY-MM.
export function monthRange(month: string): (Range & { previousFrom: Date }) | null {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) return null;
  const year = Number(match[1]);
  const m = Number(match[2]);
  if (m < 1 || m > 12) return null;
  const first = (y: number, mo: number) => {
    const d = new Date(Date.UTC(y, mo - 1, 1));
    return parseSgDate(d.toISOString().slice(0, 10))!;
  };
  return { from: first(year, m), to: first(year, m + 1), previousFrom: first(year, m - 1) };
}
