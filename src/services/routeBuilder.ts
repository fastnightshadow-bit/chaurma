import type { Location } from "../types/location.ts";

export function buildRouteUrl(
  template: string,
  location: Pick<
    Location,
    "address" | "coordinates" | "coordinatesAreConfirmed" | "mapUrl"
  >,
): string {
  const url = new URL(
    template
      .replaceAll("{lat}", String(location.coordinates.lat))
      .replaceAll("{lng}", String(location.coordinates.lng)),
  );
  const organizationUrl = new URL(location.mapUrl);
  const destination = location.coordinatesAreConfirmed
    ? `${location.coordinates.lat},${location.coordinates.lng}`
    : location.address;

  url.pathname = organizationUrl.pathname;
  url.searchParams.set("mode", "routes");
  url.searchParams.set("rtext", `~${destination}`);
  return url.toString();
}
