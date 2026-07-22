import type { BrowserContext } from "@playwright/test";
import { portfolioLinks } from "../src/data/links";
import { expect, openPortfolio, test } from "./support/portfolioTest";

const openExternalUrl = async (context: BrowserContext, url: string) => {
  const externalPage = await context.newPage();
  try {
    const response = await externalPage.goto(url, {
      waitUntil: "domcontentloaded",
    });
    return {
      status: response?.status(),
      headers: response?.headers(),
    };
  } finally {
    await externalPage.close();
  }
};

test("the CV download points to an available file", async ({ page }) => {
  await openPortfolio(page);

  const cvLinks = page.getByRole("link", { name: /download (my )?cv/i });
  await expect(cvLinks).toHaveCount(2);
  for (const cvLink of await cvLinks.all()) {
    await expect(cvLink).toHaveAttribute("href", portfolioLinks.cv);
  }

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download CV", exact: true }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  expect(await download.failure()).toBeNull();
  expect(await download.path()).not.toBeNull();
});

test("the GitHub link points to an available profile", async ({ page, context }) => {
  await openPortfolio(page);

  const link = page.getByRole("link", { name: "GitHub" });
  await expect(link).toHaveAttribute("href", portfolioLinks.github);

  const href = await link.getAttribute("href");
  if (!href) {
    throw new Error("GitHub link does not have an href");
  }

  const response = await openExternalUrl(context, href);
  expect(response.status).toBe(200);
});

test("the LinkedIn link uses the canonical profile URL", async ({ page }) => {
  await openPortfolio(page);

  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    portfolioLinks.linkedin
  );
});
