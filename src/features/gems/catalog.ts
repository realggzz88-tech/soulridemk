import { spots } from "@/data/spots";

/** Pin used for the 150 m duplicate check.
 * Replace this read with `getSpots()` from the data-layer PR once that merges.
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
