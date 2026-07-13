import type { SiteConfig } from "../types/config.ts";

export const siteConfig = {
  name: "Шаурма №1 Халял",
  shortName: "Шаурма №1",
  origin: "https://fastnightshadow-bit.github.io/chaurma",
  currency: "RUB",
  heroTitle: "Сочная шаурма. Горячая. Халял.",
  heroSubtitle: "Готовим только после заказа.",
  cartStorageKey: "shawarma-no1-cart-v1",
  cartMaxAgeHours: 24,
  routeUrlTemplate: "https://yandex.ru/maps/?rtext=~{lat},{lng}&rtt=auto",
  mapProvider: "yandex",
  seo: {
    title: "Шаурма Халяль 1 в Ярославле — две точки на Фрунзе",
    description:
      "Точки на проспекте Фрунзе, 46Б и 75 в Ярославле. Посмотрите меню, позвоните и постройте маршрут.",
  },
  isTemporaryData: true,
} as const satisfies SiteConfig;
