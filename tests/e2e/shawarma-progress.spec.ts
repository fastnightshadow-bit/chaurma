import { expect, test } from "@playwright/test";

const stages = [
  { name: "Главная", slug: "home" },
  { name: "Меню", slug: "menu" },
  { name: "Корзина", slug: "cart" },
  { name: "Маршрут", slug: "route" },
];

test("aligns the track, points, labels and shawarma to one four-column grid", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  const progress = page.getByRole("navigation", { name: "Этапы заказа" });
  const track = progress.locator("div[class*='progressTrack']");
  const shawarma = progress.locator("span[class*='progressShawarma']");

  for (const [activeIndex, stage] of stages.entries()) {
    await progress.getByRole("button", { name: stage.name }).click();
    await expect(
      progress.getByRole("button", { name: stage.name }),
    ).toHaveAttribute("aria-current", "step");
    await page.waitForTimeout(250);

    const geometry = await progress.evaluate((nav) => {
      const buttons = [...nav.querySelectorAll("button")];
      const points = buttons.map((button) =>
        button.querySelector("i")!.getBoundingClientRect(),
      );
      const labels = buttons.map((button) =>
        button.querySelector("span")!.getBoundingClientRect(),
      );
      const trackRect = nav
        .querySelector("div[class*='progressTrack']")!
        .getBoundingClientRect();
      const shawarmaRect = nav
        .querySelector("span[class*='progressShawarma']")!
        .getBoundingClientRect();

      const centers = (rects: DOMRect[]) =>
        rects.map((rect) => rect.left + rect.width / 2);

      return {
        pointCenters: centers(points),
        labelCenters: centers(labels),
        trackStart: trackRect.left,
        trackEnd: trackRect.right,
        shawarmaCenter: shawarmaRect.left + shawarmaRect.width / 2,
      };
    });

    expect(geometry.trackStart).toBeCloseTo(geometry.pointCenters[0], 1);
    expect(geometry.trackEnd).toBeCloseTo(geometry.pointCenters[3], 1);
    expect(geometry.shawarmaCenter).toBeCloseTo(
      geometry.pointCenters[activeIndex],
      1,
    );

    for (const [index, pointCenter] of geometry.pointCenters.entries()) {
      expect(geometry.labelCenters[index]).toBeCloseTo(pointCenter, 1);
    }

    await page.screenshot({
      path: `outputs/shawarma-progress/${testInfo.project.name}-${stage.slug}.png`,
      fullPage: false,
    });
  }

  await expect(track).toBeVisible();
  await expect(shawarma).toBeVisible();
});
