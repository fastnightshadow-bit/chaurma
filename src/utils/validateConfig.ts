import type { SiteConfig } from "../types/config.ts";
import type { Location } from "../types/location.ts";
import type { MenuCategory, MenuItem } from "../types/menu.ts";
import { z } from "zod";

const stableIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ID must be stable kebab-case");
const timeSchema = z
  .string()
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Invalid schedule time");

const categorySchema = z.object({
  id: stableIdSchema,
  name: z.string().trim().min(1),
});

const optionSchema = z.object({
  id: stableIdSchema,
  name: z.string().trim().min(1),
  priceDelta: z.number().nonnegative(),
  available: z.boolean(),
});

const imageSchema = z.object({
  src: z.string().refine((value) => {
    if (value.startsWith("/")) return true;
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Invalid image URL"),
  alt: z.string().trim().min(1, "Image alt text is required"),
  width: z.number().int().positive("Invalid image width"),
  height: z.number().int().positive("Invalid image height"),
});

const itemSchema = z.object({
  id: stableIdSchema,
  categoryId: stableIdSchema,
  name: z.string().trim().min(1),
  description: z.string(),
  weight: z.string(),
  price: z.number().nonnegative(),
  available: z.boolean(),
  badges: z.array(z.enum(["hit", "spicy"])),
  image: imageSchema.nullable(),
  options: z.array(optionSchema),
  allowComment: z.boolean(),
  isTemporaryData: z.boolean(),
});

const scheduleDaySchema = z.object({
  day: z.number().int().min(0).max(6),
  intervals: z.array(
    z.object({
      open: timeSchema,
      close: timeSchema,
    }),
  ),
});

const locationSchema = z.object({
  id: stableIdSchema,
  name: z.string().trim().min(1),
  address: z.string().trim().min(1),
  streetAddress: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  addressLocality: z.string().trim().min(1),
  addressRegion: z.string().trim().min(1),
  addressCountry: z.string().trim().min(2),
  phone: z.string().regex(/^\+\d{8,15}$/),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  coordinatesAreConfirmed: z.boolean(),
  preparationTime: z.string().trim().min(1),
  scheduleLabel: z.string().trim().min(1),
  timeZone: z.string().trim().min(1),
  schedule: z.array(scheduleDaySchema).min(1),
  scheduleIsConfirmed: z.boolean(),
  mapUrl: z.url(),
  socialLinks: z.array(z.url()),
  priceRange: z.string().trim().min(1).nullable(),
  isTemporarilyUnavailable: z.boolean(),
  isTemporaryData: z.boolean(),
});

const siteConfigSchema = z.object({
  name: z.string().trim().min(1),
  shortName: z.string().trim().min(1),
  origin: z.url(),
  currency: z.literal("RUB"),
  heroTitle: z.string().trim().min(1),
  heroSubtitle: z.string().trim().min(1),
  cartStorageKey: z.string().trim().min(1),
  cartMaxAgeHours: z.number().positive(),
  routeUrlTemplate: z.string().trim().min(1),
  mapProvider: z.literal("yandex"),
  seo: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
  }),
  isTemporaryData: z.boolean(),
});

function assertUniqueIds(
  values: readonly { readonly id: string }[],
  label: string,
): void {
  const ids = new Set<string>();
  for (const value of values) {
    if (ids.has(value.id))
      throw new Error(`Duplicate ${label} id: ${value.id}`);
    ids.add(value.id);
  }
}

function assertValidSchedule(location: Location): void {
  const days = new Set<number>();
  for (const scheduleDay of location.schedule) {
    if (days.has(scheduleDay.day)) {
      throw new Error(
        `Invalid schedule or time zone: duplicate day in ${location.id}`,
      );
    }
    days.add(scheduleDay.day);
  }
  try {
    new Intl.DateTimeFormat("en", { timeZone: location.timeZone }).format();
  } catch {
    throw new Error(`Invalid schedule or time zone: ${location.id}`);
  }
}

function assertSafeRouteTemplate(template: string): void {
  if (!template.includes("{lat}") || !template.includes("{lng}")) {
    throw new Error("Route URL template must contain coordinates");
  }
  let routeUrl: URL;
  try {
    routeUrl = new URL(
      template.replaceAll("{lat}", "55.75").replaceAll("{lng}", "37.61"),
    );
  } catch {
    throw new Error("Invalid route URL template");
  }
  if (routeUrl.protocol !== "https:") {
    throw new Error("Invalid route URL protocol");
  }
}

export function validateProjectData(input: {
  readonly menuCategories: readonly MenuCategory[];
  readonly menuItems: readonly MenuItem[];
  readonly locations: readonly Location[];
  readonly siteConfig: SiteConfig;
}): void {
  z.array(categorySchema).min(1).parse(input.menuCategories);
  z.array(itemSchema).min(1).parse(input.menuItems);

  const locationResult = z
    .array(locationSchema)
    .min(1)
    .safeParse(input.locations);
  if (!locationResult.success) {
    throw new Error(
      `Invalid location coordinates, schedule or time zone: ${locationResult.error.message}`,
    );
  }

  const siteConfigResult = siteConfigSchema.safeParse(input.siteConfig);
  if (!siteConfigResult.success) {
    throw new Error(
      `Invalid site URL or configuration: ${siteConfigResult.error.message}`,
    );
  }

  assertUniqueIds(input.menuCategories, "menu category");
  assertUniqueIds(input.menuItems, "menu item");
  assertUniqueIds(input.locations, "location");

  const categoryIds = new Set(input.menuCategories.map(({ id }) => id));
  for (const item of input.menuItems) {
    if (!categoryIds.has(item.categoryId)) {
      throw new Error(`Unknown menu category: ${item.categoryId}`);
    }
    assertUniqueIds(item.options, "option");
  }

  input.locations.forEach(assertValidSchedule);
  assertSafeRouteTemplate(input.siteConfig.routeUrlTemplate);
}
