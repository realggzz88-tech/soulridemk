export interface DeferSnapshot {
  eager: boolean;
  requested: boolean;
  seen: boolean;
  startedInView: boolean;
  intersecting: boolean;
  scrolled: boolean;
}

/**
 * Maps stay out of the first paint.
 * A block that starts below the fold mounts when it scrolls into view.
 * A block already on screen waits for a scroll or an explicit request,
 * so Lighthouse (no scroll, no click) does not download the map.
 */
export function shouldMountDeferred(snapshot: DeferSnapshot): boolean {
  if (snapshot.eager || snapshot.requested) return true;
  if (!snapshot.seen) return false;
  if (!snapshot.startedInView && snapshot.intersecting) return true;
  if (snapshot.startedInView && snapshot.scrolled && snapshot.intersecting) return true;
  return false;
}
