import type { Location } from "../types/location.ts";

type MapLocation = Pick<
  Location,
  "address" | "coordinates" | "coordinatesAreConfirmed" | "mapUrl"
>;

export interface MapProviderAdapter {
  readonly id: "yandex";
  readonly load: (location: MapLocation) => Promise<{ readonly src: string }>;
}

export function buildYandexMapEmbedUrl(location: MapLocation): string {
  const url = new URL("https://yandex.ru/map-widget/v1/");
  const organizationId = new URL(location.mapUrl).pathname.match(
    /(\d+)\/?$/,
  )?.[1];

  url.searchParams.set("mode", "search");
  if (organizationId) {
    url.searchParams.set("oid", organizationId);
    url.searchParams.set("ol", "biz");
  } else {
    const destination = location.coordinatesAreConfirmed
      ? `${location.coordinates.lat},${location.coordinates.lng}`
      : location.address;
    url.searchParams.set("text", destination);
  }
  url.searchParams.set("z", "16");
  return url.toString();
}

export const yandexMapProvider: MapProviderAdapter = {
  id: "yandex",
  async load(location) {
    return { src: buildYandexMapEmbedUrl(location) };
  },
};
