import type { SiteConfig } from "../types/config.ts";

export const siteConfig = {
  name: "Шаурма Халяль 1",
  shortName: "Шаурма Халяль 1",
  origin: "https://fastnightshadow-bit.github.io/chaurma",
  currency: "RUB",
  heroTitle: "Горячая шаурма с щедрой начинкой",
  heroSubtitle:
    "Готовим после заказа: много мяса, свежие овощи и фирменный соус.",
  cartStorageKey: "shawarma-no1-cart-v1",
  cartMaxAgeHours: 24,
  routeUrlTemplate: "https://yandex.ru/maps/?rtext=~{lat},{lng}&rtt=auto",
  mapProvider: "yandex",
  seo: {
    title: "Шаурма Халяль 1 в Ярославле — меню и цены",
    description:
      "Меню и цены «Шаурма Халяль 1» в Ярославле. Адреса на проспекте Фрунзе, 46Б и 75, телефоны, отзывы и маршруты до обеих точек.",
  },
  isTemporaryData: true,
} as const satisfies SiteConfig;
