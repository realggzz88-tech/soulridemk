/** TODO(backend): enforce 3/day for new accounts and 10/day for trusted ones on the server. This counter is a local preview only. */
export const NEW_ACCOUNT_DAILY_LIMIT = 3;
export const TRUSTED_ACCOUNT_DAILY_LIMIT = 10;
const STORAGE_KEY = "soulride.gem-sends";
const DAY_MS = 24 * 60 * 60 * 1000;

export function dailyLimit(trusted: boolean): number {
  return trusted ? TRUSTED_ACCOUNT_DAILY_LIMIT : NEW_ACCOUNT_DAILY_LIMIT;
}

export function recentSends(now = Date.now(), read: () => string | null = () => localStorage.getItem(STORAGE_KEY)): number[] {
  try {
    const parsed = JSON.parse(read() ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is number => typeof value === "number" && now - value < DAY_MS);
  } catch {
    return [];
  }
}

export function sendsToday(now = Date.now()): number {
  return recentSends(now).length;
}

export function retryInMs(now = Date.now()): number {
  const stamps = recentSends(now);
  if (stamps.length === 0) return 0;
  const oldest = Math.min(...stamps);
  return Math.max(0, oldest + DAY_MS - now);
}

export function formatRetry(ms: number): { hours: number; minutes: number } {
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

export function recordSend(now = Date.now()): void {
  const stamps = [...recentSends(now), now];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps));
}

/** Trusted status comes from the backend later. New accounts are the default. */
export function isTrustedAccount(): boolean {
  return false;
}
