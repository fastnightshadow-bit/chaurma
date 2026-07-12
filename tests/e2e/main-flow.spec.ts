import { expect, test } from "@playwright/test";

const cartStorageKey = "shawarma-no1-cart-v1";

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
  expect(new URL(routeHref!).searchParams.get("rtext")).toBe(
    "~просп. Фрунзе, 46Б, Ярославль",
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
