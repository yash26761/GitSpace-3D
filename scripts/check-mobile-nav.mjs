import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("https://gitspace-3d.vercel.app");

  const info = await page.evaluate(() => {
    const nav = document.querySelector("nav[aria-label='Primary Navigation']");
    const hamburger = document.querySelector("button[aria-label='Open menu'], button[aria-label='Close menu']");
    return {
      navDisplay: nav ? window.getComputedStyle(nav).display : "NOT_FOUND",
      navClass: nav ? nav.className : "",
      hamburgerDisplay: hamburger ? window.getComputedStyle(hamburger).display : "NOT_FOUND",
      hamburgerClass: hamburger ? hamburger.className : "",
      windowWidth: window.innerWidth,
    };
  });

  console.log("Mobile Element Computed Styles:", info);
  await browser.close();
}

main();
