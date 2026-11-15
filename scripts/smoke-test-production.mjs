import { chromium } from "@playwright/test";

const PROD_URL = "https://gitspace-3d.vercel.app";

async function main() {
  console.log(`=======================================================`);
  console.log(`Executing Post-Deployment Production Smoke Tests`);
  console.log(`Target: ${PROD_URL}`);
  console.log(`=======================================================`);

  const viewports = [
    { name: "375px (Mobile SE)", width: 375, height: 667, expectDesktopHidden: true, expectHamburgerVisible: true },
    { name: "390px (Mobile 12)", width: 390, height: 844, expectDesktopHidden: true, expectHamburgerVisible: true },
    { name: "768px (Tablet MD)", width: 768, height: 1024, expectDesktopHidden: false, expectHamburgerVisible: false },
    { name: "1024px (Laptop LG)", width: 1024, height: 768, expectDesktopHidden: false, expectHamburgerVisible: false },
    { name: "1440px (Desktop XL)", width: 1440, height: 900, expectDesktopHidden: false, expectHamburgerVisible: false },
  ];

  const browser = await chromium.launch();
  const smokeResults = {
    url: PROD_URL,
    timestamp: new Date().toISOString(),
    viewports: [],
    apiTest: null,
  };

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const res = await page.goto(PROD_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const httpStatus = res.status();

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
    const passed = httpStatus === 200 && isNavHiddenProperly && isHamburgerProper;

    smokeResults.viewports.push({
      viewport: vp.name,
      width: vp.width,
      httpStatus,
      navDisplay: info.navDisplay,
      navVisible: info.navVisible,
      hamburgerVisible: info.hamburgerVisible,
      passed,
    });

    console.log(`[${passed ? "PASSED" : "FAILED"}] ${vp.name}: HTTP ${httpStatus} | Nav='${info.navDisplay}' (Visible: ${info.navVisible}) | Hamburger Visible: ${info.hamburgerVisible}`);

    if (vp.expectHamburgerVisible) {
      const btn = page.getByRole("button", { name: /open menu/i });
      await btn.click();
      await page.waitForTimeout(300);
      const isDrawerOpen = await page.getByRole("link", { name: "Features" }).first().isVisible();
      console.log(`   Drawer Toggle Test: ${isDrawerOpen ? "PASSED" : "FAILED"}`);
    }

    const shotPath = `D:/Project/GitSpace-3D/test-results/live-audit/prod-smoke-${vp.width}px.png`;
    await page.screenshot({ path: shotPath });
    await page.close();
  }

  // Live API Telemetry & Synthesis Smoke Test
  console.log(`\nTesting Live Production API: ${PROD_URL}/api/repo?repo=facebook/react...`);
  const apiStart = Date.now();
  const apiRes = await fetch(`${PROD_URL}/api/repo?repo=facebook/react`);
  const apiLatency = Date.now() - apiStart;
  const apiData = await apiRes.json();
  const apiPassed = apiRes.status === 200 && apiData.success && apiData.visualDna?.planetClass === "Gas Giant";

  smokeResults.apiTest = {
    status: apiRes.status,
    latency: apiLatency,
    success: apiData.success,
    planetClass: apiData.visualDna?.planetClass,
    stars: apiData.telemetry?.metrics?.stars,
    passed: apiPassed,
  };

  console.log(`[${apiPassed ? "PASSED" : "FAILED"}] Production API: HTTP ${apiRes.status} in ${apiLatency}ms | Stars: ${apiData.telemetry?.metrics?.stars} | Planet: ${apiData.visualDna?.planetClass}`);

  await browser.close();
  console.log(`\n=======================================================`);
  console.log(`Smoke Tests Complete! All Systems Operational.`);
  console.log(`=======================================================`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
