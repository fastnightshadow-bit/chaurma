import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { menuCategories, menuItems, menuSource } from "../../src/data/menu.ts";
import { locations } from "../../src/data/locations.ts";
import { siteConfig } from "../../src/data/siteConfig.ts";
import { getBusinessStatus } from "../../src/services/businessStatus.ts";
import {
  createStoredCart,
  readStoredCart,
  refreshCartPrices,
} from "../../src/services/cartStorage.ts";
import { buildRouteUrl } from "../../src/services/routeBuilder.ts";
import { buildYandexMapEmbedUrl } from "../../src/services/mapProvider.ts";
import { createRestaurantStructuredData } from "../../src/seo/structuredData.ts";
import { initialState } from "../../src/state/initialState.ts";
import { appReducer } from "../../src/state/appReducer.ts";
import type { AppAction } from "../../src/state/actions.ts";
import type { Location } from "../../src/types/location.ts";
import { validateProjectData } from "../../src/utils/validateConfig.ts";

test("accepts the centralized project data", () => {
  assert.doesNotThrow(() =>
    validateProjectData({ menuCategories, menuItems, locations, siteConfig }),
  );
});

test("uses one search-friendly public brand name", () => {
  assert.equal(siteConfig.name, "Шаурма Халяль 1");
  assert.equal(siteConfig.shortName, "Шаурма Халяль 1");
  assert.equal(
    siteConfig.seo.title,
    "Шаурма Халяль 1 в Ярославле — меню и цены",
  );
  assert.ok(siteConfig.seo.description.includes("проспекте Фрунзе, 46Б и 75"));
  assert.ok(locations.every(({ name }) => name === siteConfig.name));
});

test("matches the verified Yandex Food menu source", () => {
  assert.deepEqual(
    menuCategories.map(({ id, name }) => ({ id, name })),
    [
      { id: "shawarma", name: "Шаурма" },
      { id: "separate-additions", name: "Добавки отдельно" },
      { id: "hot-dogs", name: "Хот-доги" },
      { id: "cold-drinks", name: "Холодные напитки" },
      { id: "hot-snacks", name: "Горячие закуски" },
    ],
  );
  assert.equal(menuItems.length, 37);
  assert.equal(menuItems[0]?.name, "Люля-кебаб в лаваше (Говядина)");
  assert.equal(menuItems[0]?.price, 580);
  assert.equal(menuItems[0]?.weight, "420 г");
  assert.equal(menuItems.at(-1)?.name, "Картошка фри");
  assert.equal(menuItems.at(-1)?.price, 210);
  assert.equal(menuItems.filter(({ image }) => image !== null).length, 37);
  assert.ok(
    menuItems.every(({ image }) => image?.src.startsWith("/images/menu/")),
  );
  assert.equal(new Set(menuItems.map(({ image }) => image?.src)).size, 24);
  assert.ok(
    menuItems.every(({ image }) =>
      image ? existsSync(join(process.cwd(), "public", image.src)) : false,
    ),
  );
  assert.ok(menuItems.every(({ isTemporaryData }) => !isTemporaryData));
  assert.equal(menuSource.upstream, "Яндекс Еда");
});

test("contains no duplicate published menu cards", () => {
  const cards = menuItems.map(
    ({ name, weight, price }) => `${name}\u0000${weight}\u0000${price}`,
  );

  assert.equal(new Set(cards).size, menuItems.length);
});

test("publishes validated social proof for every location", () => {
  assert.deepEqual(
    locations.map(({ socialProof }) => socialProof),
    [
      {
        rating: 4.9,
        ratingCount: 371,
        reviewCount: 244,
        reviewsUrl: "https://yandex.ru/maps/org/shaurma_halal_1/53165453878",
        highlights: [
          "Большие порции и много мяса",
          "Свежие овощи и фирменный соус",
          "Хрустящий лаваш",
        ],
      },
      {
        rating: 4.7,
        ratingCount: 14,
        reviewCount: 12,
        reviewsUrl: "https://yandex.ru/maps/org/shaurma_khalyal_1/148714028831",
        highlights: [
          "Свежие овощи и фирменный соус",
          "Быстрое приготовление",
          "Доброжелательный персонал",
        ],
      },
    ],
  );
});

test("rejects invalid location social proof", () => {
  const invalidLocations = [
    {
      ...locations[0],
      socialProof: {
        ...locations[0].socialProof,
        rating: 5.1,
        ratingCount: 1.5,
        highlights: ["Only one"],
        reviewsUrl: "javascript:alert(1)",
      },
    } as unknown as Location,
    ...locations.slice(1),
  ];

  assert.throws(
    () =>
      validateProjectData({
        menuCategories,
        menuItems,
        locations: invalidLocations,
        siteConfig,
      }),
    /location|rating|review|url|highlight/i,
  );
});

test("rejects duplicate menu item ids", () => {
  assert.throws(
    () =>
      validateProjectData({
        menuCategories,
        menuItems: [...menuItems, menuItems[0]],
        locations,
        siteConfig,
      }),
    /duplicate menu item id/i,
  );
});

test("rejects duplicate category and location ids", () => {
  assert.throws(
    () =>
      validateProjectData({
        menuCategories: [...menuCategories, menuCategories[0]],
        menuItems,
        locations,
        siteConfig,
      }),
    /duplicate menu category id/i,
  );
  assert.throws(
    () =>
      validateProjectData({
        menuCategories,
        menuItems,
        locations: [...locations, locations[0]],
        siteConfig,
      }),
    /duplicate location id/i,
  );
});

test("rejects a negative menu price", () => {
  const invalidItems = [{ ...menuItems[0], price: -1 }, ...menuItems.slice(1)];
  assert.throws(
    () =>
      validateProjectData({
        menuCategories,
        menuItems: invalidItems,
        locations,
        siteConfig,
      }),
    /price/i,
  );
});

test("rejects an item whose category does not exist", () => {
  const invalidItems = [
    { ...menuItems[0], categoryId: "missing-category" },
    ...menuItems.slice(1),
  ];
  assert.throws(
    () =>
      validateProjectData({
        menuCategories,
        menuItems: invalidItems,
        locations,
        siteConfig,
      }),
    /category/i,
  );
});

test("rejects coordinates outside the geographic range", () => {
  const invalidLocations = [
    { ...locations[0], coordinates: { lat: 120, lng: 40 } },
    ...locations.slice(1),
  ];
  assert.throws(
    () =>
      validateProjectData({
        menuCategories,
        menuItems,
        locations: invalidLocations,
        siteConfig,
      }),
    /coordinates/i,
  );
});

test("rejects malformed schedules and time zones", () => {
  assert.throws(
    () =>
      validateProjectData({
        menuCategories,
        menuItems,
        locations: [
          {
            ...locations[0],
            timeZone: "Unknown/Zone",
            schedule: [{ day: 8, intervals: [{ open: "25:00", close: "x" }] }],
          },
        ],
        siteConfig,
      }),
    /schedule or time zone/i,
  );
});

test("requires useful image alt text and valid image dimensions", () => {
  assert.throws(
    () =>
      validateProjectData({
        menuCategories,
        menuItems: [
          {
            ...menuItems[0],
            image: { src: "/images/item.webp", alt: "", width: 0, height: 10 },
          },
        ],
        locations,
        siteConfig,
      }),
    /image/i,
  );
});

test("rejects invalid origins, route URLs, and unstable ids", () => {
  assert.throws(
    () =>
      validateProjectData({
        menuCategories: [{ id: "Not Stable", name: "Invalid" }],
        menuItems,
        locations,
        siteConfig: {
          ...siteConfig,
          origin: "not-a-url",
          routeUrlTemplate: "javascript:{lat},{lng}",
        },
      }),
    /id|url/i,
  );
});

test("rejects duplicate option ids and invalid option prices", () => {
  const option = {
    id: "sample-option",
    name: "Option",
    priceDelta: 10,
    available: true,
  } as const;
  assert.throws(
    () =>
      validateProjectData({
        menuCategories,
        menuItems: [
          { ...menuItems[0], options: [option, option] },
          { ...menuItems[1], options: [] },
        ],
        locations,
        siteConfig,
      }),
    /duplicate option id/i,
  );
});

test("calculates open and closed status in the location timezone", () => {
  assert.equal(
    getBusinessStatus(locations[0], new Date("2026-07-06T09:00:00.000Z")),
    "open",
  );
  assert.equal(
    getBusinessStatus(locations[0], new Date("2026-07-06T21:00:00.000Z")),
    "closed",
  );
});

test("supports schedule intervals that cross midnight", () => {
  const overnightLocation = {
    ...locations[0],
    schedule: [
      { day: 3, intervals: [{ open: "22:00", close: "02:00" }] },
      { day: 4, intervals: [] },
    ],
  };
  assert.equal(
    getBusinessStatus(overnightLocation, new Date("2025-12-31T22:30:00.000Z")),
    "open",
  );
});

test("uses the address when route coordinates are not confirmed", () => {
  const locationWithUnconfirmedCoordinates = {
    ...locations[0],
    coordinates: { lat: 55.751244, lng: 37.618423 },
    coordinatesAreConfirmed: false,
  };
  const url = buildRouteUrl(
    siteConfig.routeUrlTemplate,
    locationWithUnconfirmedCoordinates,
  );
  const destination = new URL(url).searchParams.get("rtext");

  assert.equal(destination, `~${locationWithUnconfirmedCoordinates.address}`);
  assert.doesNotMatch(url, /55\.751244|37\.618423/);
});

test("routes to the exact Yandex organization marker for each location", () => {
  const expectedDestinations = ["~57.587358,39.9025", "~57.566177,39.930994"];

  locations.forEach((location, index) => {
    const route = new URL(buildRouteUrl(siteConfig.routeUrlTemplate, location));
    const organization = new URL(location.mapUrl);

    assert.equal(route.pathname, organization.pathname);
    assert.equal(route.searchParams.get("mode"), "routes");
    assert.equal(route.searchParams.get("rtt"), "auto");
    assert.equal(route.searchParams.get("rtext"), expectedDestinations[index]);
  });
});

test("builds a Yandex widget URL for each selected location", () => {
  const firstLocationWidget = new URL(buildYandexMapEmbedUrl(locations[0]));
  const secondLocationWidget = new URL(buildYandexMapEmbedUrl(locations[1]));

  assert.equal(firstLocationWidget.origin, "https://yandex.ru");
  assert.equal(firstLocationWidget.pathname, "/map-widget/v1/");
  assert.equal(firstLocationWidget.searchParams.get("oid"), "53165453878");
  assert.equal(secondLocationWidget.searchParams.get("oid"), "148714028831");
  assert.equal(secondLocationWidget.searchParams.get("ol"), "biz");
});

test("publishes only confirmed location facts in Restaurant JSON-LD", () => {
  const structuredData = createRestaurantStructuredData(siteConfig, locations);
  const [frunze46b, frunze75] = structuredData["@graph"];

  assert.ok(frunze46b);
  assert.ok(frunze75);

  assert.equal(frunze46b.name, "Шаурма Халяль 1");
  assert.equal(frunze46b.telephone, "+79997994564");
  assert.equal(
    frunze46b.image,
    `${siteConfig.origin}/images/brand/og-shawarma-no1.png`,
  );
  assert.equal(frunze46b.hasMenu, `${siteConfig.origin}/#menu`);
  assert.deepEqual(frunze46b.geo, {
    "@type": "GeoCoordinates",
    latitude: 57.587358,
    longitude: 39.9025,
  });
  assert.equal("openingHoursSpecification" in frunze46b, false);
  assert.deepEqual(frunze46b.sameAs, ["https://vk.com/shaurmahalal1"]);
  assert.deepEqual(frunze46b.aggregateRating, {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    ratingCount: 371,
    reviewCount: 244,
    bestRating: 5,
  });

  assert.equal(frunze75.name, "Шаурма Халяль 1");
  assert.equal(frunze75.telephone, "+79066366296");
  assert.equal("geo" in frunze75, true);
  assert.equal("openingHoursSpecification" in frunze75, true);
  assert.equal(frunze75.aggregateRating.ratingValue, 4.7);
});

test("marks a saved cart stale after 24 hours without removing its items", () => {
  const savedAt = new Date("2026-07-01T10:00:00.000Z");
  const stored = createStoredCart(
    {
      locationId: locations[0].id,
      items: [
        {
          id: "cart-1",
          menuItemId: menuItems[0].id,
          quantity: 2,
          unitPrice: menuItems[0].price,
          optionIds: [],
          comment: "",
        },
      ],
      orderComment: "",
    },
    savedAt,
  );

  const result = readStoredCart(
    JSON.stringify(stored),
    new Date("2026-07-02T10:00:01.000Z"),
  );

  assert.equal(result.status, "stale");
  assert.equal(result.snapshot?.items.length, 1);
});

test("uses the configured cart age threshold", () => {
  const stored = createStoredCart(
    { locationId: locations[0].id, items: [], orderComment: "" },
    new Date("2026-01-01T00:00:00.000Z"),
  );
  const result = readStoredCart(
    JSON.stringify(stored),
    new Date("2026-01-01T02:00:00.000Z"),
    1,
  );
  assert.equal(result.status, "stale");
});

test("treats corrupt stored cart data as invalid", () => {
  assert.deepEqual(readStoredCart("not-json", new Date()), {
    status: "invalid",
  });
});

test("refreshes prices in a stale cart without removing its items", () => {
  const snapshot = {
    locationId: locations[0].id,
    items: [
      {
        id: "cart-1",
        menuItemId: menuItems[0].id,
        quantity: 2,
        unitPrice: 1,
        optionIds: [],
        comment: "",
      },
    ],
    orderComment: "",
  };
  const refreshed = refreshCartPrices(snapshot, menuItems);
  assert.equal(refreshed.items.length, 1);
  assert.equal(refreshed.items[0]?.unitPrice, menuItems[0].price);
});

test("refreshes the base price and selected option prices", () => {
  const menuWithOption = [
    {
      ...menuItems[0],
      price: 300,
      options: [
        {
          id: "extra-cheese",
          name: "Extra cheese",
          priceDelta: 40,
          available: true,
        },
      ],
    },
  ];
  const snapshot = {
    locationId: locations[0].id,
    items: [
      {
        id: `${menuItems[0].id}::extra-cheese`,
        menuItemId: menuItems[0].id,
        quantity: 1,
        unitPrice: 1,
        optionIds: ["extra-cheese"],
        comment: "",
      },
    ],
    orderComment: "",
  };
  assert.equal(
    refreshCartPrices(snapshot, menuWithOption).items[0]?.unitPrice,
    340,
  );
});

test("adds, changes, and removes cart items through the reducer", () => {
  const item = {
    id: "cart-1",
    menuItemId: menuItems[0].id,
    quantity: 1,
    unitPrice: menuItems[0].price,
    optionIds: [],
    comment: "",
  };
  const added = appReducer(initialState, { type: "cart/add", item });
  assert.equal(added.cart.items.length, 1);

  const increased = appReducer(added, {
    type: "cart/setQuantity",
    itemId: item.id,
    quantity: 3,
  });
  assert.equal(increased.cart.items[0]?.quantity, 3);

  const removed = appReducer(increased, {
    type: "cart/remove",
    itemId: item.id,
  });
  assert.equal(removed.cart.items.length, 0);
});

test("updates a preparation request only for the selected cart line", () => {
  const firstItem = {
    id: "cart-1",
    menuItemId: menuItems[0].id,
    quantity: 1,
    unitPrice: menuItems[0].price,
    optionIds: [],
    comment: "",
  };
  const secondItem = {
    ...firstItem,
    id: "cart-2",
    menuItemId: menuItems[1].id,
  };
  const state = {
    ...initialState,
    cart: {
      ...initialState.cart,
      items: [firstItem, secondItem],
      orderComment: "",
    },
  };
  const action = {
    type: "cart/setItemComment",
    itemId: firstItem.id,
    comment: `  ${"Без лука ".repeat(20)}  `,
  } as unknown as AppAction;

  const updated = appReducer(state, action);

  assert.equal(updated.cart.items[0]?.comment.length, 120);
  assert.match(updated.cart.items[0]?.comment ?? "", /^Без лука/);
  assert.equal(updated.cart.items[1]?.comment, "");
});

test("stores and clears the order-wide comment independently", () => {
  const item = {
    id: "cart-1",
    menuItemId: menuItems[0].id,
    quantity: 1,
    unitPrice: menuItems[0].price,
    optionIds: [],
    comment: "Без лука",
  };
  const state = {
    ...initialState,
    cart: { ...initialState.cart, items: [item], orderComment: "" },
  };
  const updated = appReducer(state, {
    type: "cart/setOrderComment",
    comment: "Буду через 15 минут",
  } as unknown as AppAction);

  assert.equal(updated.cart.orderComment, "Буду через 15 минут");
  assert.equal(updated.cart.items[0]?.comment, "Без лука");

  const cleared = appReducer(updated, { type: "cart/clear" });
  assert.equal(cleared.cart.orderComment, "");
  assert.equal(cleared.cart.items.length, 0);
});

test("persists version 2 comments and migrates version 1 carts", () => {
  const snapshot = {
    locationId: locations[0].id,
    orderComment: "Буду через 15 минут",
    items: [
      {
        id: "cart-1",
        menuItemId: menuItems[0].id,
        quantity: 1,
        unitPrice: menuItems[0].price,
        optionIds: [],
        comment: "Без лука",
      },
    ],
  };
  const stored = createStoredCart(snapshot, new Date("2026-07-13T10:00:00Z"));

  assert.equal(stored.version, 2);
  assert.deepEqual(
    readStoredCart(JSON.stringify(stored), new Date("2026-07-13T11:00:00Z")),
    { status: "fresh", snapshot },
  );

  const versionOne = {
    version: 1,
    savedAt: "2026-07-13T10:00:00.000Z",
    locationId: locations[0].id,
    items: snapshot.items,
  };
  assert.deepEqual(
    readStoredCart(
      JSON.stringify(versionOne),
      new Date("2026-07-13T11:00:00Z"),
    ),
    {
      status: "fresh",
      snapshot: { ...snapshot, orderComment: "" },
    },
  );
});
