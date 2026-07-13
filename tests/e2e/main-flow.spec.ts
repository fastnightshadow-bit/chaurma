import { expect, test } from "@playwright/test";

const cartStorageKey = "shawarma-no1-cart-v1";

test("renders the art-directed shawarma photograph for the current viewport", async ({
  page,
}) => {
  await page.goto("/");

  const isMobile = (page.viewportSize()?.width ?? 0) <= 760;
  const expectedSource = isMobile
    ? "hero-shawarma-mobile.webp"
    : "hero-shawarma.webp";
  const expectedNaturalWidth = isMobile ? 900 : 1600;
  const expectedVisualScale = isMobile ? 1.3 : 1;

  const heroImage = page.getByRole("img", {
    name: "Шаурма с мясом, свежими овощами и фирменным соусом",
  });
  await expect(heroImage).toBeVisible();
  await expect
    .poll(() =>
      heroImage.evaluate((image: HTMLImageElement) => ({
        complete: image.complete,
        currentSource: new URL(image.currentSrc).pathname,
        naturalWidth: image.naturalWidth,
        objectFit: getComputedStyle(image).objectFit,
        visualScale: (() => {
          const transform = getComputedStyle(image).transform;
          return transform === "none"
            ? 1
            : Number(transform.slice(7, -1).split(",")[0]);
        })(),
      })),
    )
    .toEqual({
      complete: true,
      currentSource: expect.stringContaining(expectedSource),
      naturalWidth: expectedNaturalWidth,
      objectFit: "cover",
      visualScale: expectedVisualScale,
    });
});

test("completes the primary pickup path and restores the cart", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Сочная шаурма. Горячая. Халял.",
    }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Добавить: Классическая шаурма (пример)" })
    .click();
  const menuCard = page
    .getByRole("region", { name: "Меню" })
    .getByRole("article")
    .filter({
      has: page.getByRole("heading", {
        level: 3,
        name: "Классическая шаурма (пример)",
      }),
    });
  await expect(menuCard.getByRole("status")).toHaveText("1");

  await page
    .getByRole("navigation", { name: "Основная навигация" })
    .getByRole("button", { name: /Корзина/ })
    .click();
  const cartRegion = page.getByRole("region", { name: "Корзина" });
  await expect(
    cartRegion.getByRole("heading", { level: 2, name: "Корзина" }),
  ).toBeVisible();
  await expect(cartRegion.getByText("290 ₽").first()).toBeVisible();

  const callAction = cartRegion.getByRole("link", { name: /Позвонить/ });
  await expect(callAction).toHaveAttribute("href", /^tel:\+7/);

  await page.getByRole("button", { name: "Показать заказ продавцу" }).click();
  await expect(page.getByRole("dialog", { name: "Мой заказ" })).toBeVisible();
  await page.getByRole("button", { name: "Закрыть заказ" }).click();

  await page.reload();
  await expect(
    cartRegion.getByRole("heading", {
      level: 3,
      name: "Классическая шаурма (пример)",
    }),
  ).toBeVisible();

  const routeAction = page.getByRole("link", { name: "Построить маршрут" });
  const routeHref = await routeAction.getAttribute("href");
  expect(routeHref).not.toBeNull();
  const routeUrl = new URL(routeHref!);
  expect(routeUrl.pathname).toBe("/maps/org/shaurma_halal_1/53165453878");
  expect(routeUrl.searchParams.get("mode")).toBe("routes");
  expect(routeUrl.searchParams.get("rtext")).toBe("~57.587358,39.9025");
});

test("enables map interaction without trapping mobile page scrolling", async ({
  page,
}) => {
  await page.goto("/#route");

  const routeSection = page.locator("#route");
  const map = routeSection.locator("iframe");
  await expect(map).toBeVisible();

  const isMobile = (page.viewportSize()?.width ?? 0) <= 760;
  if (isMobile) {
    const enableInteraction = routeSection.getByRole("button", {
      name: "Управлять картой",
    });
    await expect(enableInteraction).toBeVisible();
    await expect
      .poll(() => map.evaluate((node) => getComputedStyle(node).pointerEvents))
      .toBe("none");

    await enableInteraction.click();
    await expect
      .poll(() => map.evaluate((node) => getComputedStyle(node).pointerEvents))
      .toBe("auto");

    await routeSection
      .getByRole("button", { name: "Закончить работу с картой" })
      .click();
    await expect
      .poll(() => map.evaluate((node) => getComputedStyle(node).pointerEvents))
      .toBe("none");
  } else {
    await expect
      .poll(() => map.evaluate((node) => getComputedStyle(node).pointerEvents))
      .toBe("auto");
    await expect(
      routeSection.getByRole("button", { name: "Управлять картой" }),
    ).toBeHidden();
  }
});

test("switches the map marker and exact route with the selected location", async ({
  page,
}) => {
  await page.goto("/#route");

  const routeSection = page.locator("#route");
  const map = routeSection.locator("iframe");
  const routeAction = routeSection.getByRole("link", {
    name: "Построить маршрут",
  });

  await expect(map).toHaveAttribute("src", /oid=53165453878/);
  await expect(routeAction).toHaveAttribute(
    "href",
    /shaurma_halal_1\/53165453878.*rtext=%7E57\.587358%2C39\.9025/,
  );

  await page
    .getByRole("group", { name: "Выберите точку" })
    .getByRole("button")
    .nth(1)
    .click();

  await expect(map).toHaveAttribute("src", /oid=148714028831/);
  await expect(routeAction).toHaveAttribute(
    "href",
    /shaurma_khalyal_1\/148714028831.*rtext=%7E57\.566177%2C39\.930994/,
  );
});

test("asks before resolving a cart older than 24 hours", async ({ page }) => {
  await page.addInitScript((storageKey) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        savedAt: "2020-01-01T00:00:00.000Z",
        locationId: "frunze-46b",
        items: [
          {
            id: "sample-classic-shawarma",
            menuItemId: "sample-classic-shawarma",
            quantity: 1,
            unitPrice: 1,
            optionIds: [],
            comment: "",
          },
        ],
      }),
    );
  }, cartStorageKey);
  await page.goto("/");

  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toContainText(
    "Ваш прошлый заказ устарел. Проверить актуальность?",
  );
  await dialog
    .getByRole("button", { name: "Обновить цены и оставить заказ" })
    .click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("region", { name: "Корзина" }).getByText("290 ₽").first(),
  ).toBeVisible();
});

test("skips motion-only effects when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Сочная шаурма. Горячая. Халял.",
    }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    )
    .toBe("auto");
});

test("keeps the cart usable in memory when localStorage is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage unavailable");
      },
    });
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Добавить: Классическая шаурма (пример)" })
    .click();
  await expect(
    page.getByText("Корзина сохранится только до закрытия этой вкладки."),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Корзина" }).getByText("290 ₽").first(),
  ).toBeVisible();
});

test("updates social proof with the selected location and exposes safe external links", async ({
  page,
}) => {
  await page.goto("/");

  const reviews = page.getByRole("region", { name: "Нас выбирают" });
  await expect(reviews.getByText("4,9")).toBeVisible();
  await expect(reviews.getByText("371 оценка")).toBeVisible();
  await expect(reviews.getByText("244 отзыва")).toBeVisible();
  await expect(
    reviews.getByRole("link", { name: "Читать отзывы на Яндекс Картах" }),
  ).toHaveAttribute(
    "href",
    "https://yandex.ru/maps/org/shaurma_halal_1/53165453878",
  );

  await page
    .getByRole("group", { name: "Выберите точку" })
    .getByRole("button")
    .nth(1)
    .click();

  await expect(reviews.getByText("4,7")).toBeVisible();
  await expect(reviews.getByText("14 оценок")).toBeVisible();
  await expect(reviews.getByText("12 отзывов")).toBeVisible();
  await expect(
    reviews.getByRole("link", { name: "Читать отзывы на Яндекс Картах" }),
  ).toHaveAttribute(
    "href",
    "https://yandex.ru/maps/org/shaurma_khalyal_1/148714028831",
  );

  const vkLink = page.getByRole("link", { name: "Мы во ВКонтакте" });
  await expect(vkLink).toHaveAttribute("href", "https://vk.com/shaurmahalal1");
  await expect(vkLink).toHaveAttribute("target", "_blank");
  await expect(vkLink).toHaveAttribute("rel", "noopener noreferrer");

  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});
