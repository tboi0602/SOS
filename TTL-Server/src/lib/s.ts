export function s(value: unknown, fallback: string = ""): string {
  if (value === undefined || value === null) return fallback;
  return String(value);
}