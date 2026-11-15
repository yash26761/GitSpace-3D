import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("https://gitspace-3d.vercel.app");

  const matches = await page.evaluate(() => {
    const nav = document.querySelector("nav[aria-label='Primary Navigation']");
    const sheets = Array.from(document.styleSheets);
    const results = [];
    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules);
        for (const r of rules) {
          if (r.selectorText && nav.matches(r.selectorText)) {
            results.push({ selector: r.selectorText, cssText: r.cssText });
          }
        }
      } catch (e) {}
    }
    return results;
  });

  console.log("Matched CSS rules on mobile:", matches);
  await browser.close();
}

main();
