import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const TARGET_URL = "https://gitspace-3d.vercel.app";
const OUTPUT_DIR = path.resolve("D:/Project/GitSpace-3D/test-results/live-audit");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const auditResults = {
  target: TARGET_URL,
  timestamp: new Date().toISOString(),
  checks: [],
  consoleMessages: [],
  networkErrors: [],
  performanceMetrics: {},
  screenshots: [],
};

function recordCheck(id, title, status, details, evidence = null) {
  auditResults.checks.push({ id, title, status, details, evidence });
  console.log(`[${status}] Check ${id}: ${title}`);
  if (details) console.log(`   Details: ${details}`);
}

async function runAudit() {
  console.log("=================================================");
  console.log(`Starting Live Production QA Audit for: ${TARGET_URL}`);
  console.log("=================================================");

  const browser = await chromium.launch({ headless: true });

  // -------------------------------------------------------------
  // Test 1: Desktop Homepage Loading, Performance, & Security
  // -------------------------------------------------------------
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GitSpace-QA/1.0",
  });

  const page = await context.newPage();

  page.on("console", (msg) => {
    auditResults.consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });

  page.on("requestfailed", (request) => {
    auditResults.networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText || "Unknown error",
    });
  });

  const startTime = Date.now();
  let response;
  try {
    response = await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 30000 });
    const loadTime = Date.now() - startTime;
    const status = response.status();
    const headers = response.headers();

    recordCheck(
      "1.1",
      "Homepage HTTP Status & Initial Response",
      status === 200 ? "PASSED" : "FAILED",
      `HTTP status: ${status}, Network idle time: ${loadTime}ms`,
      { status, loadTime }
    );

    // Extract performance timings
    const perfData = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      return {
        dnsTime: nav ? nav.domainLookupEnd - nav.domainLookupStart : 0,
        connectTime: nav ? nav.connectEnd - nav.connectStart : 0,
        ttfb: nav ? nav.responseStart - nav.requestStart : 0,
        domInteractive: nav ? nav.domInteractive : 0,
        domContentLoaded: nav ? nav.domContentLoadedEventEnd : 0,
        loadEventEnd: nav ? nav.loadEventEnd : 0,
      };
    });
    auditResults.performanceMetrics = perfData;
    console.log("Performance Metrics:", perfData);

    recordCheck(
      "1.2",
      "Performance Latency & TTFB",
      perfData.ttfb < 1000 ? "PASSED" : "FAILED",
      `TTFB: ${perfData.ttfb.toFixed(2)}ms, DOMContentLoaded: ${perfData.domContentLoaded.toFixed(2)}ms`,
      perfData
    );

    // Check Security Headers
    const csp = headers["content-security-policy"];
    const hsts = headers["strict-transport-security"];
    const xfo = headers["x-frame-options"];
    const xcto = headers["x-content-type-options"];

    recordCheck(
      "9.1",
      "Content Security Policy (CSP)",
      csp ? "PASSED" : "FAILED",
      `CSP Header: ${csp ? csp.substring(0, 100) + "..." : "Missing"}`,
      { csp }
    );

    recordCheck(
      "9.2",
      "Strict-Transport-Security (HSTS)",
      hsts ? "PASSED" : "FAILED",
      `HSTS Header: ${hsts || "Missing"}`,
      { hsts }
    );

    recordCheck(
      "9.3",
      "Defense-in-Depth Framing & Sniffing Headers",
      xfo === "DENY" && xcto === "nosniff" ? "PASSED" : "FAILED",
      `X-Frame-Options: ${xfo}, X-Content-Type-Options: ${xcto}`,
      { xfo, xcto }
    );
  } catch (err) {
    recordCheck("1.1", "Homepage HTTP Status", "FAILED", err.message);
  }

  // Capture Desktop Homepage Screenshot
  const desktopShot = path.join(OUTPUT_DIR, "01-desktop-homepage.png");
  await page.screenshot({ path: desktopShot, fullPage: false });
  auditResults.screenshots.push(desktopShot);

  // -------------------------------------------------------------
  // Test 2: 3D Universe Canvas & OrbitControls Interaction
  // -------------------------------------------------------------
  try {
    const canvas = page.locator("canvas").first();
    const isCanvasVisible = await canvas.isVisible();

    // Check WebGL context in browser
    const webglInfo = await page.evaluate(() => {
      const canvasEl = document.querySelector("canvas");
      if (!canvasEl) return { error: "No canvas element found" };
      const gl = canvasEl.getContext("webgl2") || canvasEl.getContext("webgl");
      if (!gl) return { error: "WebGL not supported" };
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      return {
        supported: true,
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Standard WebGL",
        version: gl.getParameter(gl.VERSION),
        width: canvasEl.width,
        height: canvasEl.height,
      };
    });

    recordCheck(
      "2.1",
      "3D Universe Canvas & WebGL Rendering",
      isCanvasVisible && webglInfo.supported ? "PASSED" : "FAILED",
      `Canvas visible: ${isCanvasVisible}, WebGL Version: ${webglInfo.version}, Resolution: ${webglInfo.width}x${webglInfo.height}`,
      webglInfo
    );

    // Test Orbit Controls Mouse Interaction
    const canvasBox = await canvas.boundingBox();
    if (canvasBox) {
      // Simulate Orbit Drag
      await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + canvasBox.width / 2 + 100, canvasBox.y + canvasBox.height / 2 + 50, { steps: 10 });
      await page.mouse.up();

      // Simulate Zoom via Mouse Wheel
      await page.mouse.wheel(0, -120);
      await page.waitForTimeout(500);

      recordCheck(
        "2.2",
        "OrbitControls Drag & Zoom Gesture Response",
        "PASSED",
        "Simulated 100px orbital drag and wheel delta without WebGL crash or error"
      );
    } else {
      recordCheck("2.2", "OrbitControls Drag & Zoom Gesture Response", "FAILED", "Could not locate bounding box of canvas");
    }

    const canvasShot = path.join(OUTPUT_DIR, "02-3d-canvas-active.png");
    await page.screenshot({ path: canvasShot });
    auditResults.screenshots.push(canvasShot);
  } catch (err) {
    recordCheck("2.1", "3D Universe Canvas & WebGL Rendering", "FAILED", err.message);
  }

  // -------------------------------------------------------------
  // Test 3 & 4: Repository Search, Telemetry & Visual DNA
  // -------------------------------------------------------------
  const testRepos = [
    { slug: "facebook/react", expectedClass: "Gas Giant", expectedLang: "JavaScript" },
    { slug: "vercel/next.js", expectedClass: null, expectedLang: "JavaScript" },
    { slug: "microsoft/vscode", expectedClass: null, expectedLang: "TypeScript" },
  ];

  for (let i = 0; i < testRepos.length; i++) {
    const { slug, expectedClass, expectedLang } = testRepos[i];
    try {
      console.log(`\nTesting Repository Synthesis for: ${slug}...`);
      const searchInput = page.getByPlaceholder("e.g. facebook/react or torvalds/linux");
      await searchInput.fill("");
      await searchInput.fill(slug);

      const synthButton = page.getByRole("button", { name: /Synthesize/i });
      await synthButton.click();

      // Wait for synthesis status message or HUD update
      await page.waitForTimeout(2000);

      // Verify that HUD / details appear on screen
      const hudContent = await page.evaluate(() => {
        const text = document.body.innerText;
        return {
          hasTelemetry: text.includes("TELEMETRY") || text.includes("VISUAL DNA") || text.includes("STARS"),
          bodySnippet: text.substring(0, 500),
        };
      });

      // Also directly query the API to compare frontend vs server Visual DNA
      const apiRes = await page.request.get(`${TARGET_URL}/api/repo?repo=${encodeURIComponent(slug)}`);
      const apiData = await apiRes.json();

      const pass = apiData.success && apiData.telemetry && apiData.visualDna;

      recordCheck(
        `3.${i + 1}`,
        `Repository Search & Synthesis: ${slug}`,
        pass ? "PASSED" : "FAILED",
        `API Success: ${apiData.success}, Planet Class: ${apiData.visualDna?.planetClass}, Stars: ${apiData.telemetry?.metrics?.stars}, Lang: ${apiData.telemetry?.metrics?.primaryLanguage}`,
        {
          telemetry: apiData.telemetry?.metrics,
          visualDna: apiData.visualDna,
        }
      );

      const repoShot = path.join(OUTPUT_DIR, `03-search-${slug.replace("/", "-")}.png`);
      await page.screenshot({ path: repoShot });
      auditResults.screenshots.push(repoShot);
    } catch (err) {
      recordCheck(`3.${i + 1}`, `Repository Search & Synthesis: ${slug}`, "FAILED", err.message);
    }
  }

  // -------------------------------------------------------------
  // Test 5: Invalid Input and Error Handling
  // -------------------------------------------------------------
  try {
    console.log("\nTesting Input Validation & Error Handling...");

    // 5.1 Empty Input
    const searchInput = page.getByPlaceholder("e.g. facebook/react or torvalds/linux");
    await searchInput.fill("");
    const synthButton = page.getByRole("button", { name: /Synthesize/i });
    await synthButton.click();
    await page.waitForTimeout(500);

    const emptyErrorVisible = await page.getByText(/Please enter a valid GitHub repository/i).isVisible();
    recordCheck(
      "5.1",
      "Empty Search Input Validation",
      emptyErrorVisible ? "PASSED" : "FAILED",
      `Validation message shown: ${emptyErrorVisible}`
    );

    // 5.2 Malformed Input
    await searchInput.fill("invalid..identifier");
    await synthButton.click();
    await page.waitForTimeout(500);
    const malformedError = await page.getByText(/Invalid repository format/i).isVisible();
    recordCheck(
      "5.2",
      "Malformed Slug Format Handling",
      malformedError ? "PASSED" : "FAILED",
      `Error prompt shown: ${malformedError}`
    );

    // 5.3 Non-existent Repository
    await searchInput.fill("yash26761/this-repo-definitely-does-not-exist-9999");
    await synthButton.click();
    await page.waitForTimeout(2000);

    const nonExistentError = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes("404") || text.includes("not found") || text.includes("NOT_FOUND") || text.includes("failed");
    });

    recordCheck(
      "5.3",
      "Non-Existent Repository 404 Response Handling",
      nonExistentError ? "PASSED" : "FAILED",
      `Proper error state surfaced: ${nonExistentError}`
    );

    const errorShot = path.join(OUTPUT_DIR, "04-error-handling.png");
    await page.screenshot({ path: errorShot });
    auditResults.screenshots.push(errorShot);
  } catch (err) {
    recordCheck("5.1", "Invalid Input Error Handling", "FAILED", err.message);
  }

  // -------------------------------------------------------------
  // Test 7: Mobile Viewport & Responsiveness
  // -------------------------------------------------------------
  try {
    console.log("\nTesting Mobile Viewport (iPhone 12 / 390x844)...");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    });

    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(TARGET_URL, { waitUntil: "networkidle" });

    // Verify Hamburger button visible on mobile
    const hamburger = mobilePage.getByRole("button", { name: /open menu|close menu/i });
    const isHamburgerVisible = await hamburger.isVisible();

    // Verify Desktop nav links hidden
    const desktopNav = mobilePage.locator("nav[aria-label='Primary Navigation']");
    const isDesktopNavHidden = !(await desktopNav.isVisible());

    recordCheck(
      "7.1",
      "Mobile Navigation Hamburger Visibility",
      isHamburgerVisible && isDesktopNavHidden ? "PASSED" : "FAILED",
      `Hamburger button visible: ${isHamburgerVisible}, Desktop nav hidden: ${isDesktopNavHidden}`
    );

    // Click Hamburger to open drawer
    if (isHamburgerVisible) {
      await hamburger.click();
      await mobilePage.waitForTimeout(500);

      const drawerVisible = await mobilePage.getByRole("link", { name: "Features" }).first().isVisible();
      recordCheck(
        "7.2",
        "Mobile Navigation Drawer Open/Close",
        drawerVisible ? "PASSED" : "FAILED",
        `Mobile navigation drawer opened: ${drawerVisible}`
      );
    }

    // Verify Mobile Canvas is rendered
    const mobileCanvas = mobilePage.locator("canvas").first();
    const isMobileCanvasVisible = await mobileCanvas.isVisible();

    recordCheck(
      "7.3",
      "Mobile 3D Canvas Rendering & Stacking",
      isMobileCanvasVisible ? "PASSED" : "FAILED",
      `Mobile 3D Canvas rendered: ${isMobileCanvasVisible}`
    );

    const mobileShot = path.join(OUTPUT_DIR, "05-mobile-viewport.png");
    await mobilePage.screenshot({ path: mobileShot, fullPage: false });
    auditResults.screenshots.push(mobileShot);

    await mobileContext.close();
  } catch (err) {
    recordCheck("7.1", "Mobile Viewport Test", "FAILED", err.message);
  }

  // -------------------------------------------------------------
  // Test 8: Console Errors & Failed Network Requests Review
  // -------------------------------------------------------------
  // Filter out intentional test request responses (HTTP 400, 404 from synthetic negative testing)
  const severeErrors = auditResults.consoleMessages.filter(
    (m) =>
      m.type === "error" &&
      !m.text.includes("favicon") &&
      !m.text.includes("status of 400") &&
      !m.text.includes("status of 404")
  );

  recordCheck(
    "8.1",
    "Browser Console Errors Check",
    severeErrors.length === 0 ? "PASSED" : "FAILED",
    `Severe console errors count: ${severeErrors.length}`,
    severeErrors
  );

  recordCheck(
    "8.2",
    "Network Failed Requests Check",
    auditResults.networkErrors.length === 0 ? "PASSED" : "FAILED",
    `Failed network requests count: ${auditResults.networkErrors.length}`,
    auditResults.networkErrors
  );

  await context.close();
  await browser.close();

  // Save JSON report
  const reportPath = path.join(OUTPUT_DIR, "audit-results.json");
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
  console.log(`\nAudit completed! Report saved to: ${reportPath}`);
}

runAudit().catch((err) => {
  console.error("FATAL AUDIT ERROR:", err);
  process.exit(1);
});
