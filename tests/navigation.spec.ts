import { navigationItems } from "../src/data/navigation";
import { expect, openPortfolio, test } from "./support/portfolioTest";

test("the hero call to action opens Experience", async ({ page }) => {
  await openPortfolio(page);

  await page.getByRole("link", { name: "View experience" }).click();
  await expect(page.locator("#experience")).toBeInViewport();
});

test(
  "desktop navigation opens every portfolio section",
  async ({ page, isMobile }) => {
    test.skip(
      isMobile,
      "Desktop navigation is covered by the mobile disclosure test"
    );
    await openPortfolio(page);
    const navigation = page.getByRole("navigation", {
      name: "Primary navigation",
    });

    for (const item of navigationItems) {
      await navigation.getByRole("link", { name: item.label }).click();
      await expect(page.locator(item.href)).toBeInViewport();
    }
  }
);

test(
  "mobile navigation behaves as an accessible disclosure",
  async ({ page, isMobile }) => {
    test.skip(!isMobile, "The navigation disclosure is only displayed on mobile");
    await openPortfolio(page);

    const openButton = page.getByRole("button", { name: "Open navigation" });
    await expect(openButton).toHaveAttribute(
      "aria-controls",
      "primary-navigation-links"
    );
    await expect(openButton).toHaveAttribute("aria-expanded", "false");

    await openButton.click();
    const closeButton = page.getByRole("button", { name: "Close navigation" });
    await expect(closeButton).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(openButton).toHaveAttribute("aria-expanded", "false");

    await openButton.click();
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Experience" })
      .click();
    await expect(openButton).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#experience")).toBeInViewport();
  }
);
