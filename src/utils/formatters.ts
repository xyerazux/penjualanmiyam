export function formatRupiah(value: number): string {
  const absVal = Math.abs(Math.round(value));
  const formatted = absVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return value < 0 ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

export function formatNumber(value: number): string {
  return value.toString().replace('.', ',');
}

export function getCurrentTimeStr(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getTodayLabel(): string {
  return `Hari ini, ${getCurrentTimeStr()}`;
}

