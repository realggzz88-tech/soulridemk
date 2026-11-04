import type { RouteListItem } from "./model";

export type DifficultyKey = "easy" | "moderate" | "challenging";
export type LengthKey = "short" | "mid" | "long";
export type SortKey = "recommended" | "shortest" | "longest" | "easiest";
export type RegionKey = "east" | "west" | "central" | "multi";

export interface RouteQuery {
  difficulty: "all" | DifficultyKey;
  regions: RegionKey[];
  length: "all" | LengthKey;
  sort: SortKey;
}

export const defaultQuery: RouteQuery = {
  difficulty: "all",
  regions: [],
  length: "all",
  sort: "recommended",
};

const regionKeys: RegionKey[] = ["east", "west", "central", "multi"];
const regionByValue: Record<RouteListItem["region"], RegionKey> = {
  East: "east",
  West: "west",
  Central: "central",
  "Multi-Region": "multi",
};

const difficultyRank: Record<RouteListItem["difficulty"], number> = {
  Easy: 0,
  Moderate: 1,
  Challenging: 2,
};

export function regionKeyOf(region: RouteListItem["region"]): RegionKey {
  return regionByValue[region];
}

/** Inclusive at the low end: ≤80, 81–120, then over 120. */
export function lengthBucket(distanceKm: number): LengthKey {
  if (distanceKm <= 80) return "short";
  if (distanceKm <= 120) return "mid";
  return "long";
}

export function applyRouteQuery(items: RouteListItem[], query: RouteQuery): RouteListItem[] {
  const filtered = items.filter((item) => {
    if (query.difficulty !== "all" && item.difficulty.toLowerCase() !== query.difficulty) return false;
    if (query.regions.length > 0 && !query.regions.includes(regionKeyOf(item.region))) return false;
    if (query.length !== "all" && lengthBucket(item.distanceKm) !== query.length) return false;
    return true;
  });

  const sorted = [...filtered];
  if (query.sort === "shortest") {
    sorted.sort((a, b) => a.distanceKm - b.distanceKm || a.order - b.order);
  } else if (query.sort === "longest") {
    sorted.sort((a, b) => b.distanceKm - a.distanceKm || a.order - b.order);
  } else if (query.sort === "easiest") {
    sorted.sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty] || a.order - b.order);
  } else {
    sorted.sort((a, b) => a.order - b.order);
  }
  return sorted;
}

export function regionCounts(items: RouteListItem[], query: RouteQuery): Record<RegionKey, number> {
  const base = applyRouteQuery(items, { ...query, regions: [] });
  return {
    east: base.filter((item) => item.region === "East").length,
    west: base.filter((item) => item.region === "West").length,
    central: base.filter((item) => item.region === "Central").length,
    multi: base.filter((item) => item.region === "Multi-Region").length,
  };
}

export function lengthCounts(items: RouteListItem[], query: RouteQuery): Record<LengthKey, number> {
  const base = applyRouteQuery(items, { ...query, length: "all" });
  return {
    short: base.filter((item) => lengthBucket(item.distanceKm) === "short").length,
    mid: base.filter((item) => lengthBucket(item.distanceKm) === "mid").length,
    long: base.filter((item) => lengthBucket(item.distanceKm) === "long").length,
  };
}

export function difficultyCounts(
  items: RouteListItem[],
  query: RouteQuery,
): Record<"all" | DifficultyKey, number> {
  const base = applyRouteQuery(items, { ...query, difficulty: "all" });
  return {
    all: base.length,
    easy: base.filter((item) => item.difficulty === "Easy").length,
    moderate: base.filter((item) => item.difficulty === "Moderate").length,
    challenging: base.filter((item) => item.difficulty === "Challenging").length,
  };
}

function isRegionKey(value: string): value is RegionKey {
  return regionKeys.includes(value as RegionKey);
}

export function queryFromParams(params: URLSearchParams): RouteQuery {
  const difficulty = params.get("d");
  const length = params.get("len");
  const sort = params.get("sort");
  const regions = (params.get("r") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(isRegionKey);

  return {
    difficulty:
      difficulty === "easy" || difficulty === "moderate" || difficulty === "challenging" ? difficulty : "all",
    regions,
    length: length === "short" || length === "mid" || length === "long" ? length : "all",
    sort: sort === "shortest" || sort === "longest" || sort === "easiest" ? sort : "recommended",
  };
}

export function paramsFromQuery(query: RouteQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.difficulty !== "all") params.set("d", query.difficulty);
  if (query.regions.length > 0) params.set("r", query.regions.join(","));
  if (query.length !== "all") params.set("len", query.length);
  if (query.sort !== "recommended") params.set("sort", query.sort);
  return params;
}

export function sheetFilterCount(query: RouteQuery): number {
  let count = 0;
  if (query.regions.length > 0) count += 1;
  if (query.length !== "all") count += 1;
  if (query.sort !== "recommended") count += 1;
  return count;
}

export function hasActiveQuery(query: RouteQuery): boolean {
  return query.difficulty !== "all" || sheetFilterCount(query) > 0;
}
