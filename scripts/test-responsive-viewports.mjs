import { chromium } from "@playwright/test";
import { spawn } from "child_process";
import path from "path";

async function main() {
  console.log("Starting Next.js local server on port 3009 for responsive verification...");
  const server = spawn("npx", ["next", "start", "-p", "3009"], {
    cwd: "D:/Project/GitSpace-3D",
    shell: true,
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 3500));

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
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("http://localhost:3009", { waitUntil: "networkidle" });

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

    // If on mobile, test clicking hamburger to open drawer
    if (vp.expectHamburgerVisible) {
      const btn = page.getByRole("button", { name: /open menu/i });
      await btn.click();
      await page.waitForTimeout(300);
      const drawerVisible = await page.getByRole("link", { name: "Features" }).first().isVisible();
      console.log(`   Mobile Drawer Open Test: ${drawerVisible ? "PASSED" : "FAILED"}`);
    }

    const shotPath = `D:/Project/GitSpace-3D/test-results/live-audit/vp-${vp.width}px.png`;
    await page.screenshot({ path: shotPath });
    await page.close();
  }

  await browser.close();
  server.kill("SIGTERM");
  console.log("\nResponsive Viewport Test Completed:", results);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
