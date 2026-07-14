import type { SiteConfig } from "@/types/config";
import type { Location } from "@/types/location";

const schemaWeekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function createRestaurantStructuredData(
  config: SiteConfig,
  locations: readonly Location[],
) {
  return {
    "@context": "https://schema.org",
    "@graph": locations.map((location) => {
      const openingHoursSpecification = location.schedule.flatMap((day) =>
        day.intervals.map((interval) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: schemaWeekdays[day.day],
          opens: interval.open,
          closes: interval.close,
        })),
      );

      return {
        "@type": "Restaurant",
        "@id": `${config.origin}/#${location.id}`,
        name: location.name,
        url: config.origin,
        image: `${config.origin}/images/brand/og-shawarma-no1.png`,
        hasMenu: `${config.origin}/#menu`,
        hasMap: location.mapUrl,
        telephone: location.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: location.streetAddress,
          postalCode: location.postalCode,
          addressLocality: location.addressLocality,
          addressRegion: location.addressRegion,
          addressCountry: location.addressCountry,
        },
        ...(location.coordinatesAreConfirmed
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: location.coordinates.lat,
                longitude: location.coordinates.lng,
              },
            }
          : {}),
        ...(location.scheduleIsConfirmed ? { openingHoursSpecification } : {}),
        ...(location.socialLinks.length > 0
          ? { sameAs: location.socialLinks }
          : {}),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: location.socialProof.rating,
          ratingCount: location.socialProof.ratingCount,
          reviewCount: location.socialProof.reviewCount,
          bestRating: 5,
        },
        ...(location.priceRange ? { priceRange: location.priceRange } : {}),
        servesCuisine: ["Шаурма", "Быстрое питание"],
      };
    }),
  };
}
