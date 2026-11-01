import type { Control, FeatureGroup, LeafletEvent } from "leaflet";

export interface ClusterIconSource {
  getChildCount(): number;
}

export interface MarkerClusterOptions {
  maxClusterRadius: number;
  spiderfyOnMaxZoom: boolean;
  showCoverageOnHover: boolean;
  zoomToBoundsOnClick: boolean;
  iconCreateFunction: (cluster: ClusterIconSource) => object;
}

interface LeafletWithCluster {
  markerClusterGroup: (options: MarkerClusterOptions) => FeatureGroup;
}

function hasMarkerClusterGroup(leaflet: object): leaflet is LeafletWithCluster {
  return (
    "markerClusterGroup" in leaflet &&
    typeof (leaflet as { markerClusterGroup?: unknown }).markerClusterGroup === "function"
  );
}

/** leaflet.markercluster attaches this factory onto the Leaflet namespace at runtime. */
export function createMarkerClusterGroup(
  leaflet: object,
  options: MarkerClusterOptions,
): FeatureGroup {
  if (!hasMarkerClusterGroup(leaflet)) {
    throw new Error("leaflet.markercluster is not loaded");
  }
  return leaflet.markerClusterGroup(options);
}

export interface RoutingPathStyle {
  color: string;
  opacity: number;
  weight: number;
  dashArray?: string;
}

export interface RoutingLineOptions {
  styles: RoutingPathStyle[];
  extendToWaypoints: boolean;
  missingRouteTolerance: number;
}

export interface RoutingControlOptions {
  waypoints: { lat: number; lng: number }[];
  routeWhileDragging: boolean;
  addWaypoints: boolean;
  draggableWaypoints: boolean;
  fitSelectedRoutes: boolean;
  showAlternatives: boolean;
  altLineOptions: RoutingLineOptions;
  lineOptions: RoutingLineOptions;
  createMarker: () => null;
  router: unknown;
}

interface RouteSummary {
  totalDistance: number;
  totalTime: number;
}

export interface RoutingControl extends Control {
  on(type: string, fn: (event: LeafletEvent) => void): this;
}

interface LeafletRouting {
  control: (options: RoutingControlOptions) => RoutingControl;
  osrmv1: (options: { serviceUrl: string; profile: string }) => unknown;
}

interface LeafletWithRouting {
  Routing: LeafletRouting;
}

function hasRouting(leaflet: object): leaflet is LeafletWithRouting {
  if (!("Routing" in leaflet)) return false;
  const routing = (leaflet as { Routing?: { control?: unknown; osrmv1?: unknown } }).Routing;
  return typeof routing?.control === "function" && typeof routing?.osrmv1 === "function";
}

export function createOsrmRouter(
  leaflet: object,
  options: { serviceUrl: string; profile: string },
): unknown {
  if (!hasRouting(leaflet)) {
    throw new Error("leaflet-routing-machine is not loaded");
  }
  return leaflet.Routing.osrmv1(options);
}

export function createRoutingControl(
  leaflet: object,
  options: RoutingControlOptions,
): ReturnType<LeafletRouting["control"]> {
  if (!hasRouting(leaflet)) {
    throw new Error("leaflet-routing-machine is not loaded");
  }
  return leaflet.Routing.control(options);
}

/** Pull distance and duration off a leaflet-routing-machine `routesfound` event. */
export function readRouteSummary(
  event: LeafletEvent,
): { totalDistance: number; totalTime: number } | null {
  if (!("routes" in event)) return null;
  const routes = (event as LeafletEvent & { routes: unknown }).routes;
  if (!Array.isArray(routes) || routes.length === 0) return null;

  const first: unknown = routes[0];
  if (typeof first !== "object" || first === null || !("summary" in first)) return null;

  const summary = (first as { summary: unknown }).summary;
  if (typeof summary !== "object" || summary === null) return null;

  const { totalDistance, totalTime } = summary as Partial<RouteSummary>;
  if (typeof totalDistance !== "number" || typeof totalTime !== "number") return null;
  return { totalDistance, totalTime };
}
