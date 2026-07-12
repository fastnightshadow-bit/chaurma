import type { Location } from "../types/location.ts";

const temporarySchedule = Array.from({ length: 7 }, (_, day) => ({
  day,
  intervals: [{ open: "10:00", close: "22:00" }],
}));

const dailySchedule = Array.from({ length: 7 }, (_, day) => ({
  day,
  intervals: [{ open: "10:00", close: "23:00" }],
}));

export const locations = [
  {
    id: "frunze-46b",
    name: "Shaurma Halal 1",
    address: "просп. Фрунзе, 46Б, Ярославль",
    streetAddress: "просп. Фрунзе, 46Б",
    postalCode: "150006",
    addressLocality: "Ярославль",
    addressRegion: "Ярославская область",
    addressCountry: "RU",
    phone: "+79997994564",
    // TODO: Keep placeholder coordinates until the owner resolves the roughly 40 m difference between Yandex and 2GIS markers.
    coordinates: { lat: 55.751244, lng: 37.618423 },
    coordinatesAreConfirmed: false,
    // TODO: The preparation time is not published in the verified sources.
    preparationTime: "пример: 10–15 минут",
    // TODO: Yandex and Restaurant Guru show 10:00–23:00, while 2GIS showed Saturday until 24:00.
    scheduleLabel: "пример: ежедневно 10:00–22:00",
    timeZone: "Europe/Moscow",
    schedule: temporarySchedule,
    scheduleIsConfirmed: false,
    mapUrl: "https://yandex.ru/maps/org/shaurma_halal_1/53165453878",
    socialLinks: ["https://vk.com/shaurmahalal1"],
    priceRange: "200–350 ₽",
    isTemporarilyUnavailable: false,
    isTemporaryData: true,
  },
  {
    id: "frunze-75",
    name: "Шаурма Халяль 1",
    address: "просп. Фрунзе, 75, Ярославль",
    streetAddress: "просп. Фрунзе, 75",
    postalCode: "150006",
    addressLocality: "Ярославль",
    addressRegion: "Ярославская область",
    addressCountry: "RU",
    phone: "+79066366296",
    coordinates: { lat: 57.566177, lng: 39.930994 },
    coordinatesAreConfirmed: true,
    // TODO: The preparation time is not published in the verified sources.
    preparationTime: "пример: 10–15 минут",
    scheduleLabel: "ежедневно 10:00–23:00",
    timeZone: "Europe/Moscow",
    schedule: dailySchedule,
    scheduleIsConfirmed: true,
    mapUrl: "https://yandex.ru/maps/org/shaurma_khalyal_1/148714028831",
    socialLinks: [],
    // TODO: The average check and on-site prices for this location are not published.
    priceRange: null,
    isTemporarilyUnavailable: false,
    isTemporaryData: true,
  },
] as const satisfies readonly Location[];
