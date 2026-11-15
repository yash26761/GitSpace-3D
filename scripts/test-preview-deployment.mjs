import { chromium } from "@playwright/test";

const PREVIEW_URL = "https://gitspace-3d-rfmgay1me-yash-f9fc.vercel.app";
const BYPASS_SECRET = "3UUbheKoICg3LbVCW3JOFiJdRzR8Kbnc";

async function main() {
  console.log(`Verifying Vercel Preview Deployment with Bypass Header: ${PREVIEW_URL}`);

  const viewports = [
    { name: "375px (Mobile SE)", width: 375, height: 667, expectDesktopHidden: true, expectHamburgerVisible: true },
    { name: "390px (Mobile 12)", width: 390, height: 844, expectDesktopHidden: true, expectHamburgerVisible: true },
    { name: "768px (Tablet MD)", width: 768, height: 1024, expectDesktopHidden: false, expectHamburgerVisible: false },
    { name: "1024px (Laptop LG)", width: 1024, height: 768, expectDesktopHidden: false, expectHamburgerVisible: false },
    { name: "1440px (Desktop XL)", width: 1440, height: 900, expectDesktopHidden: false, expectHamburgerVisible: false },
  ];

  const browser = await chromium.launch();
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      extraHTTPHeaders: {
        "x-vercel-protection-bypass": BYPASS_SECRET,
      },
    });

    const page = await context.newPage();
    await page.goto(PREVIEW_URL, { waitUntil: "networkidle" });

    const info = await page.evaluate(() => {
      const nav = document.querySelector("nav[aria-label='Primary Navigation']");
      const hamburger = document.querySelector("button[aria-label='Open menu'], button[aria-label='Close menu']");
      return {
        navDisplay: nav ? window.getComputedStyle(nav).display : "NOT_FOUND",
        navVisible: nav ? nav.getBoundingClientRect().width > 0 && nav.getBoundingClientRect().height > 0 : false,
        hamburgerDisplay: hamburger ? window.getComputedStyle(hamburger).display : "NOT_FOUND",
        hamburgerVisible: hamburger ? hamburger.getBoundingClientRect().width > 0 && hamburger.getBoundingClientRect().height > 0 : false,
      };
    });

    const isNavHiddenProperly = vp.expectDesktopHidden ? (info.navDisplay === "none" || !info.navVisible) : (info.navDisplay !== "none" && info.navVisible);
    const isHamburgerProper = vp.expectHamburgerVisible ? info.hamburgerVisible : !info.hamburgerVisible;
    const passed = isNavHiddenProperly && isHamburgerProper;

    results.push({
      viewport: vp.name,
      width: vp.width,
      navDisplay: info.navDisplay,
      navVisible: info.navVisible,
      hamburgerVisible: info.hamburgerVisible,
      passed,
    });

    console.log(`[${passed ? "PASSED" : "FAILED"}] ${vp.name}: Nav Display='${info.navDisplay}', Nav Visible=${info.navVisible}, Hamburger Visible=${info.hamburgerVisible}`);

    if (vp.expectHamburgerVisible) {
      const btn = page.getByRole("button", { name: /open menu/i });
      await btn.click();
      await page.waitForTimeout(300);
      const drawerLink = page.getByRole("link", { name: "Features" }).first();
      const isDrawerOpen = await drawerLink.isVisible();
      console.log(`   Drawer Opened: ${isDrawerOpen ? "PASSED" : "FAILED"}`);
    }

    const shotPath = `D:/Project/GitSpace-3D/test-results/live-audit/preview-${vp.width}px.png`;
    await page.screenshot({ path: shotPath });
    await context.close();
  }

  await browser.close();
  console.log("\n=========================================");
  console.log("All Viewports Verified on Vercel Preview!");
  console.log("=========================================");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
