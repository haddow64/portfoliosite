import type { Page } from "@playwright/test";
import { expect, openPortfolio, test } from "./support/portfolioTest";

const expectNoHorizontalOverflow = async (page: Page) => {
  const widths = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    root: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));

  expect(widths.body).toBeLessThanOrEqual(widths.viewport + 1);
  expect(widths.root).toBeLessThanOrEqual(widths.viewport + 1);
};

test("the page fits the viewport without horizontal scrolling", async ({ page }) => {
  await openPortfolio(page);
  await expectNoHorizontalOverflow(page);
});

test("experience content keeps each role summary before its bullet list", async ({ page }) => {
  await openPortfolio(page);

  const roles = page.locator(".timeline-item");
  await expect(roles).toHaveCount(3);
  for (const role of await roles.all()) {
    await expect(role.locator(":scope > div + ul")).toBeVisible();
    await expect(role.getByRole("listitem").first()).toBeVisible();
  }
});

test("mobile contact controls remain usable touch targets", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Touch-target sizing is checked at the mobile viewport");
  await openPortfolio(page);

  const contacts = page.locator("#connect").getByRole("link");
  await expect(contacts).toHaveCount(3);
  for (const contact of await contacts.all()) {
    const box = await contact.boundingBox();
    expect(box, "Contact control should be visible").not.toBeNull();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test("mobile layout supports text enlarged to 200 percent", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Text zoom is checked at the mobile viewport");
  await openPortfolio(page);

  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
