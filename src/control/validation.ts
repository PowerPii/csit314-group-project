// Input rules shared by several controllers.
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Empty text fields are stored as null.
export function blankToNull(text: string): string | null {
  const trimmed = text.trim();
  return trimmed ? trimmed : null;
}

export type ActionResult = { ok: true } | { ok: false; error: string };
