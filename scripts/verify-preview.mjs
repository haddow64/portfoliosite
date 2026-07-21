import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:4174/portfoliosite/";
const chromePath =
  process.env.CHROME_PATH ??
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "/usr/bin/google-chrome");

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const assertCenteredRows = async (page, containerSelector, itemSelector, viewportName) => {
  const rows = await page.evaluate(
    ({ containerSelector, itemSelector }) => {
      const container = document.querySelector(containerSelector);
      const items = Array.from(document.querySelectorAll(itemSelector));
      if (!container || items.length === 0) {
        return [];
      }

      const containerBox = container.getBoundingClientRect();
      const grouped = new Map();
      for (const item of items) {
        const box = item.getBoundingClientRect();
        const key = Math.round(box.top);
        const current = grouped.get(key) ?? [];
        current.push({ left: box.left, right: box.right });
        grouped.set(key, current);
      }

      const maxItems = Math.max(...Array.from(grouped.values()).map((row) => row.length));
      return Array.from(grouped.values())
        .filter((row) => row.length < maxItems)
        .map((row) => {
          const left = Math.min(...row.map((box) => box.left));
          const right = Math.max(...row.map((box) => box.right));
          return {
            containerCenter: containerBox.left + containerBox.width / 2,
            rowCenter: left + (right - left) / 2,
          };
        });
    },
    { containerSelector, itemSelector }
  );

  for (const row of rows) {
    assert(
      Math.abs(row.containerCenter - row.rowCenter) <= 2,
      `${viewportName}: ${itemSelector} partial row is not centered`
    );
  }
};

const assertTimelineBulletsBelowHeadings = async (page, viewportName) => {
  const violations = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".timeline-item")).flatMap((item) => {
      const headingBlock = item.querySelector("div");
      const bullets = item.querySelector("ul");
      if (!headingBlock || !bullets) {
        return [];
      }

      const headingBottom = headingBlock.getBoundingClientRect().bottom;
      const bulletsTop = bullets.getBoundingClientRect().top;
      return bulletsTop >= headingBottom ? [] : [item.querySelector("h3")?.textContent ?? "role"];
    })
  );

  assert(
    violations.length === 0,
    `${viewportName}: experience bullets are not below headings for ${violations.join(", ")}`
  );
};

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});

try {
  await mkdir("verification", { recursive: true });

  for (const viewport of [
    { name: "desktop", width: 1440, height: 1200 },
    { name: "mobile", width: 390, height: 900 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: "light",
    });
    const browserErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        browserErrors.push(`console: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => {
      browserErrors.push(`page: ${error.message}`);
    });

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `verification/${viewport.name}.png`, fullPage: true });

    const intro = page.getByText("Hi I'm Graeme.");
    const role = page.getByText("A Lead Software Engineer.");
    assert(await intro.isVisible(), `${viewport.name}: hero intro is not visible`);
    assert(await role.isVisible(), `${viewport.name}: hero role is not visible`);
    assert(
      (await page.locator("h1").count()) === 1,
      `${viewport.name}: page does not have exactly one h1`
    );
    assert(
      (await page.getByRole("link", { name: /skip to main content/i }).count()) === 1,
      `${viewport.name}: skip link is missing`
    );
    await page.keyboard.press("Tab");
    assert(
      (await page.evaluate(() => document.activeElement?.textContent?.trim())) ===
        "Skip to main content",
      `${viewport.name}: skip link is not the first keyboard target`
    );
    await page.keyboard.press("Enter");
    assert(
      (await page.evaluate(() => document.activeElement?.id)) === "main-content",
      `${viewport.name}: skip link does not move focus to main content`
    );
    assert(
      (await page.locator("main").count()) === 1,
      `${viewport.name}: page does not have exactly one main landmark`
    );
    assert(
      await page.getByText("Diageo | April 2023 to present").isVisible(),
      `${viewport.name}: Diageo role is not shown correctly`
    );
    assert(
      (await page.getByRole("link", { name: /view experience/i }).getAttribute("href")) ===
        "#experience",
      `${viewport.name}: hero primary CTA does not link to Experience`
    );
    assert(
      ((await page.getByRole("link", { name: /download my cv/i }).getAttribute("href")) ?? "")
        .includes("_green.pdf"),
      `${viewport.name}: Experience CV link does not point to the green CV`
    );

    const overflow = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    assert(
      overflow.body <= overflow.viewport + 1,
      `${viewport.name}: page overflows horizontally (${overflow.body} > ${overflow.viewport})`
    );

    const pageAlignment = await page.evaluate(() => {
      const viewportCenter = document.documentElement.clientWidth / 2;
      const main = document.querySelector("main")?.getBoundingClientRect();
      const content = Array.from(
        document.querySelectorAll(".home-container, main > .section")
      ).map((element) => {
        const box = element.getBoundingClientRect();
        return Math.abs(box.left + box.width / 2 - viewportCenter);
      });

      return {
        mainWidth: main?.width ?? 0,
        viewportWidth: document.documentElement.clientWidth,
        content,
      };
    });
    assert(
      Math.abs(pageAlignment.mainWidth - pageAlignment.viewportWidth) <= 1,
      `${viewport.name}: main landmark does not span the viewport`
    );
    assert(
      pageAlignment.content.every((offset) => offset <= 2),
      `${viewport.name}: page content is not horizontally centered`
    );

    const brokenImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src)
    );
    assert(
      brokenImages.length === 0,
      `${viewport.name}: broken images found: ${brokenImages.join(", ")}`
    );

    const profileImage = page.getByRole("img", { name: "Graeme Haddow" });
    assert(
      ((await profileImage.getAttribute("src")) ?? "").endsWith("profile-400.webp"),
      `${viewport.name}: profile image does not use the optimized WebP source`
    );
    assert(
      (await profileImage.getAttribute("fetchpriority")) === "high",
      `${viewport.name}: profile image is not marked as high priority`
    );

    await page.getByRole("button", { name: /switch to dark mode/i }).click();
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    assert(theme === "dark", `${viewport.name}: theme toggle did not switch to dark mode`);

    if (viewport.name === "desktop") {
      await assertCenteredRows(page, ".skills-cards", ".skills-card", viewport.name);
      await assertCenteredRows(page, ".impact-grid", ".impact-card", viewport.name);
      await assertCenteredRows(page, ".timeline", ".timeline-item", viewport.name);
      await assertTimelineBulletsBelowHeadings(page, viewport.name);

      await page.locator('.nav-links a[href="#experience"]').click();
      await page.waitForTimeout(1800);
      const experiencePosition = await page.evaluate(() => ({
        navBottom: document.querySelector(".nav-wrapper")?.getBoundingClientRect().bottom,
        targetTop: document.getElementById("experience")?.getBoundingClientRect().top,
      }));
      assert(
        experiencePosition.targetTop >= experiencePosition.navBottom - 2 &&
          experiencePosition.targetTop < 140,
        `desktop: Experience navigation offset is incorrect (${JSON.stringify(experiencePosition)})`
      );
    } else {
      const menuButton = page.getByRole("button", { name: /open navigation/i });
      assert(
        (await menuButton.getAttribute("aria-controls")) ===
          "primary-navigation-links",
        "mobile: navigation button does not identify the controlled links"
      );
      await menuButton.click();
      assert(
        (await page.getByRole("button", { name: /close navigation/i }).getAttribute(
          "aria-expanded"
        )) === "true",
        "mobile: navigation button does not expose its expanded state"
      );
      await page.keyboard.press("Escape");
      assert(
        (await page.getByRole("button", { name: /open navigation/i }).getAttribute(
          "aria-expanded"
        )) === "false",
        "mobile: Escape does not close the navigation"
      );

      const contactButtons = await page.evaluate(() =>
        Array.from(document.querySelectorAll(".grid-flow a")).map((link) => {
          const box = link.getBoundingClientRect();
          return { top: Math.round(box.top), width: box.width, height: box.height };
        })
      );
      assert(contactButtons.length === 3, "mobile: expected three contact buttons");
      assert(
        new Set(contactButtons.map((button) => button.top)).size === 1,
        "mobile: contact buttons do not remain on one row"
      );
      assert(
        contactButtons.every((button) => button.width >= 44 && button.height >= 44),
        "mobile: contact buttons are smaller than the minimum touch target"
      );

      await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
      const enlargedTextLayout = await page.evaluate(() => ({
        bodyWidth: document.body.scrollWidth,
        rootWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      assert(
        enlargedTextLayout.bodyWidth <= enlargedTextLayout.viewportWidth + 1 &&
          enlargedTextLayout.rootWidth <= enlargedTextLayout.viewportWidth + 1,
        `mobile: 200% text causes horizontal overflow (${JSON.stringify(enlargedTextLayout)})`
      );
    }

    assert(
      browserErrors.length === 0,
      `${viewport.name}: browser errors found: ${browserErrors.join("; ")}`
    );
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`Preview verified at ${baseUrl}`);
