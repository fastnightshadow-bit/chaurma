import type { Location } from "../types/location.ts";

export function buildRouteUrl(
  template: string,
  location: Pick<
    Location,
    "address" | "coordinates" | "coordinatesAreConfirmed"
  >,
): string {
  const url = new URL(
    template
      .replaceAll("{lat}", String(location.coordinates.lat))
      .replaceAll("{lng}", String(location.coordinates.lng)),
  );
  const destination = location.coordinatesAreConfirmed
    ? `${location.coordinates.lat},${location.coordinates.lng}`
    : location.address;

  url.searchParams.set("rtext", `~${destination}`);
  return url.toString();
}
