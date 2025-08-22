export function parseUtcDateOnly(isoString: string): Date {
  const [year, month, day] = isoString.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toDateInputValue(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}
