export function s(value: unknown, fallback?: string): string | undefined {
  if (value === undefined || value === null) return fallback ?? undefined
  return String(value)
}
