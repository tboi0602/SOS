export function generateMemberId(): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join("");
  return `THV-TV-${digits}`;
}
