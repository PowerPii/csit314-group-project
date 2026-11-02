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

const IMAGE_TYPES = ["image/png", "image/jpeg"];
const MB = 1024 * 1024;

// PNG or JPG no bigger than maxMb.
export function isValidImage(file: File, maxMb: number): boolean {
  return IMAGE_TYPES.includes(file.type) && file.size <= maxMb * MB;
}

export function isValidUrl(text: string): boolean {
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
