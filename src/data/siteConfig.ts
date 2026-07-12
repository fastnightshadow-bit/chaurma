import type { SiteConfig } from "../types/config.ts";

export const siteConfig = {
  name: "Шаурма №1 Халял",
  shortName: "Шаурма №1",
  // TODO: Replace the placeholder after the owner confirms the production domain. Canonical, robots and sitemap derive from this value.
  origin: "https://example.com",
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
