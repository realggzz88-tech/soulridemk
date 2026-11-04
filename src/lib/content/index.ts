export type {
  CreditGroup,
  Difficulty,
  ExternalCredit,
  Lang,
  OwnCredit,
  Photo,
  Region as ContentRegion,
  Route as ContentRoute,
  Spot as ContentSpot,
  SpotPage,
  SpotQuery,
  SpotRegion,
} from "./types";

export { getCredits, getRoute, getRoutes, getSpot, getSpots, loadCredits, loadRoute, loadRoutes, loadSpot, loadSpots, querySpots } from "./api";
export { useCredits, useRoute, useRoutes, useSpot, useSpots, useUiRoute, useUiRoutes, useUiSpot, useUiSpots } from "./hooks";
export { photoDisplaySrc, toUiRoute, toUiSpot } from "./present";
export { CONTENT_STALE_TIME_MS, resolveContentSource } from "./source";
export type { ContentEnv, ContentSource } from "./source";

export type { Spot, Region } from "@/data/spots";
export { allTags, regions } from "@/data/spots";
export type { Route } from "@/data/routes";
export {
  foodDrinkStops,
  foodRegionMap,
  macedonianLocations,
  popularRoutes,
  regionRouteMap,
} from "@/data/journeyData";
