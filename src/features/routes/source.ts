import { routes } from "@/data/routes";
import { toRouteListItem, type RouteListItem } from "./model";

/**
 * Thin read for the routes list.
 *
 * Today this adapts `src/data/routes`. `stage2/data-layer` owns `src/lib/content`.
 * When that branch lands, replace this function with `getRoutes()` and keep the
 * list UI on `RouteListItem`. Do not import `@/data` from the list components.
 */
export async function loadRouteList(): Promise<RouteListItem[]> {
  return routes.map((route, order) => toRouteListItem(route, order));
}
