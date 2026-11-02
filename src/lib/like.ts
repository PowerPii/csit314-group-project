// Makes %, _ and \ in user input match literally inside an ilike pattern.
export function escapeLike(text: string): string {
  return text.replace(/[\\%_]/g, (c) => `\\${c}`);
}
