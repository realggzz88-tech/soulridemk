import { spots } from "@/data/spots";

/** Pin used for the 150 m duplicate check.
 * TODO(data-layer): replace this read with `getSpots()` once PR #3 merges.
 */
export interface SpotPin {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

export function listSpotPins(): SpotPin[] {
  return spots.map((spot) => ({
    id: spot.id,
    title: spot.title,
    lat: spot.coordinates.lat,
    lng: spot.coordinates.lng,
  }));
}
