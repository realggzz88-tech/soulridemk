import { describe, expect, it } from "vitest";
import { spots, type Spot } from "@/data/spots";
import { routes, type Route } from "@/data/routes";

const SPOT_REGIONS = ["West", "Central", "East"] as const;
const ROUTE_REGIONS = ["East", "West", "Central", "Multi-Region"] as const;
const DIFFICULTIES = ["Easy", "Moderate", "Challenging"] as const;

function expectNonEmpty(value: string, label: string) {
  expect(value.trim().length, label).toBeGreaterThan(0);
}

function expectSpotShape(spot: Spot) {
  expect(spot.id).toMatch(/^[a-z0-9-]+$/);
  expectNonEmpty(spot.title, `${spot.id} title`);
  expectNonEmpty(spot.description, `${spot.id} description`);
  expectNonEmpty(spot.longDescription, `${spot.id} longDescription`);
  expectNonEmpty(spot.poeticTagline, `${spot.id} poeticTagline`);
  expect(spot.tags.length, `${spot.id} tags`).toBeGreaterThan(0);
  expect(spot.tags.every((tag) => tag.trim().length > 0)).toBe(true);
  expect(SPOT_REGIONS, spot.id).toContain(spot.region);
  expect(spot.riderTips.length, `${spot.id} riderTips`).toBeGreaterThan(0);
  expect(Number.isFinite(spot.coordinates.lat)).toBe(true);
  expect(Number.isFinite(spot.coordinates.lng)).toBe(true);
  expect(spot.coordinates.lat).toBeGreaterThan(40.5);
  expect(spot.coordinates.lat).toBeLessThan(42.6);
  expect(spot.coordinates.lng).toBeGreaterThan(20.2);
  expect(spot.coordinates.lng).toBeLessThan(23.2);
}

function expectRouteShape(route: Route, spotIds: Set<string>) {
  expect(route.id).toMatch(/^[a-z0-9-]+$/);
  expectNonEmpty(route.title, `${route.id} title`);
  expectNonEmpty(route.description, `${route.id} description`);
  expectNonEmpty(route.poeticTagline, `${route.id} poeticTagline`);
  expectNonEmpty(route.longDescription, `${route.id} longDescription`);
  expectNonEmpty(route.duration, `${route.id} duration`);
  expectNonEmpty(route.distance, `${route.id} distance`);
  expect(ROUTE_REGIONS, route.id).toContain(route.region);
  expect(DIFFICULTIES, route.id).toContain(route.difficulty);
  expect(route.spotIds.length, `${route.id} spotIds`).toBeGreaterThan(0);
  expect(new Set(route.spotIds).size, `${route.id} duplicate stops`).toBe(route.spotIds.length);
  for (const spotId of route.spotIds) {
    expect(spotIds.has(spotId), `${route.id} references missing spot ${spotId}`).toBe(true);
  }
  for (const spotId of Object.keys(route.thingsToDo)) {
    expect(route.spotIds, `${route.id} thingsToDo ${spotId}`).toContain(spotId);
    expectNonEmpty(route.thingsToDo[spotId], `${route.id} thingsToDo ${spotId}`);
  }
  expect(route.highlights.length).toBeGreaterThan(0);
  expect(route.activities.length).toBeGreaterThan(0);
  expect(route.riderTips.length).toBeGreaterThan(0);
  expect(route.eatAndRest.length).toBeGreaterThan(0);
  for (const stop of route.eatAndRest) {
    expectNonEmpty(stop.name, `${route.id} eatAndRest name`);
    expectNonEmpty(stop.description, `${route.id} eatAndRest description`);
  }
  expectNonEmpty(route.routeDetails.elevation, `${route.id} elevation`);
  expectNonEmpty(route.routeDetails.roadCondition, `${route.id} roadCondition`);
  expectNonEmpty(route.routeDetails.bestSeason, `${route.id} bestSeason`);
  expectNonEmpty(route.routeDetails.fuelStops, `${route.id} fuelStops`);
}

describe("spot catalog", () => {
  it("has unique ids and the fields a spot page needs", () => {
    const ids = spots.map((spot) => spot.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(spots.length).toBeGreaterThan(0);
    for (const spot of spots) expectSpotShape(spot);
  });
});

describe("route catalog", () => {
  it("has unique ids, required fields, and stops that exist as spots", () => {
    const ids = routes.map((route) => route.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(routes.length).toBeGreaterThan(0);
    const spotIds = new Set(spots.map((spot) => spot.id));
    for (const route of routes) expectRouteShape(route, spotIds);
  });
});
