/** True when the browser already has a Supabase auth token stored by the client. */
export function hasStoredSupabaseSession(storage: Storage = localStorage): boolean {
  try {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key || !key.startsWith("sb-") || !key.endsWith("-auth-token")) continue;
      const raw = storage.getItem(key);
      if (raw && raw !== "null") return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function scheduleIdle(task: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout: 1200 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, 0);
  return () => window.clearTimeout(id);
}
