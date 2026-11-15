import { test, expect } from "@playwright/test";

test.describe("GitSpace 3D — Landing Page & Navigation Suite", () => {
  test("renders the cosmic headline, pill badge, and system metrics", async ({ page }) => {
    await page.goto("/");

    // Verify Brand Pill Badge
    await expect(page.locator("#overview").getByText("GitSpace 3D")).toBeVisible();
    await expect(page.getByText("Live GitHub Ingestion & Visual DNA")).toBeVisible();

    // Verify Main Headline
    await expect(
      page.getByRole("heading", { name: /Transform Codebases into a 3D Celestial Universe/i })
    ).toBeVisible();

    // Verify System Metrics Strip
    await expect(page.getByText("WebGL 2.0 / R3F")).toBeVisible();
    await expect(page.getByText("60 FPS Ultra-Smooth")).toBeVisible();
    await expect(page.getByText("Zero Code Storage").first()).toBeVisible();
  });

  test("verifies all 6 interactive feature cards are present", async ({ page }) => {
    await page.goto("/#features");

    await expect(page.getByText("Planetary Architecture")).toBeVisible();
    await expect(page.getByText("Dynamic Orbital Physics")).toBeVisible();
    await expect(page.getByText("Deep Cosmological Telemetry")).toBeVisible();
    await expect(page.getByText("GPU-Accelerated Shaders")).toBeVisible();
    await expect(page.getByText("Zero Code Ingestion")).toBeVisible();
    await expect(page.getByText("Living Ecosystem")).toBeVisible();
  });

  test("verifies 3D canvas container mounts cleanly", async ({ page }) => {
    await page.goto("/");

    // Locate the visualization section
    const visSection = page.locator("#visualization");
    await expect(visSection).toBeVisible();

    // Ensure HUD overlay is rendered inside the canvas container
    await expect(page.getByText("Interactive 3D Orbit Viewport")).toBeVisible();
    await expect(page.getByText("GPU Shaders: Active")).toBeVisible();
    await expect(page.getByText("Rayleigh Atmosphere: Active")).toBeVisible();
  });
});

test.describe("GitSpace 3D — Search Console & API Telemetry Suite", () => {
  test("shows validation error on empty search submission", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder("e.g. facebook/react or torvalds/linux");
    await expect(searchInput).toBeVisible();

    // Submit without input
    await page.getByRole("button", { name: /Synthesize/i }).click();

    // Status message should indicate validation error
    await expect(
      page.getByText(/Please enter a valid GitHub repository in 'owner\/repo' format/i)
    ).toBeVisible();
  });

  test("synthesizes repository successfully when preset is clicked", async ({ page }) => {
    // Intercept /api/repo to test deterministic integration
    await page.route("**/api/repo?repo=facebook%2Freact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          cached: false,
          telemetry: {
            id: 10270250,
            name: "react",
            fullName: "facebook/react",
            description: "The library for web and native user interfaces.",
            url: "https://github.com/facebook/react",
            owner: { login: "facebook", avatarUrl: "https://github.com/facebook.png", type: "Organization" },
            metrics: {
              stars: 230000,
              forks: 46000,
              openIssues: 850,
              watchers: 230000,
              sizeKB: 320000,
              primaryLanguage: "JavaScript",
              languages: { JavaScript: 850000, TypeScript: 150000 },
              totalBytes: 1000000,
              createdAt: "2013-05-24T16:15:54Z",
              updatedAt: "2026-11-15T00:00:00Z",
              pushedAt: "2026-11-15T00:00:00Z",
              defaultBranch: "main",
              isArchived: false,
            },
          },
          visualDna: {
            name: "react",
            fullName: "facebook/react",
            planetClass: "Oceanic",
            radius: 2.1,
            orbitalRadius: 18.5,
            orbitalSpeed: 0.13,
            initialAngle: 0.45,
            axialTilt: 0.23,
            rotationSpeed: 0.85,
            colorBase: "#423806",
            colorSurface: "#f7df1e",
            colorAtmosphere: "#fef08a",
            noiseScale: 3.1,
            roughness: 0.4,
            atmospherePower: 2.3,
            hasRing: true,
            ringInnerRadius: 1.35,
            ringOuterRadius: 2.2,
            ringColor: "#60a5fa",
            activityScore: 0.98,
          },
        }),
      });
    });

    await page.goto("/");

    // Click the React live preset button
    await page.getByRole("button", { name: "React" }).click();

    // Verify success feedback message
    await expect(page.getByText(/Synthesized "facebook\/react" into Oceanic/i)).toBeVisible();

    // Verify Telemetry & Visual DNA Inspector Strip appears
    await expect(page.getByText("The library for web and native user interfaces.")).toBeVisible();
    await expect(page.getByText("Language Architecture Breakdown")).toBeVisible();
    await expect(page.getByText(/JavaScript:/i)).toBeVisible();
  });

  test("handles 404 repository not found gracefully", async ({ page }) => {
    await page.route("**/api/repo?repo=nonexistent%2Fcelestial-void-404", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: 'GitHub repository "nonexistent/celestial-void-404" was not found or is private.',
          code: "NOT_FOUND",
        }),
      });
    });

    await page.goto("/");

    const searchInput = page.getByPlaceholder("e.g. facebook/react or torvalds/linux");
    await searchInput.fill("nonexistent/celestial-void-404");
    await page.getByRole("button", { name: /Synthesize/i }).click();

    await expect(page.getByText(/was not found or is private/i)).toBeVisible();
  });

  test("handles 429 rate limit exceeded gracefully", async ({ page }) => {
    await page.route("**/api/repo?repo=facebook%2Freact", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: "GitHub API rate limit exceeded. Limit resets at 2:00 PM.",
          code: "RATE_LIMITED",
        }),
      });
    });

    await page.goto("/");
    const searchInput = page.getByPlaceholder("e.g. facebook/react or torvalds/linux");
    await searchInput.fill("facebook/react");
    await page.getByRole("button", { name: /Synthesize/i }).click();

    await expect(page.getByText(/GitHub API rate limit exceeded/i)).toBeVisible();
  });
});

test.describe("GitSpace 3D — Responsive & Mobile Viewport Suite", () => {
  test("renders responsive mobile layout and burger navigation", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      // Mobile header shows branding and menu trigger
      await expect(page.getByRole("banner").getByText("GitSpace 3D")).toBeVisible();
      const menuButton = page.getByLabel("Open menu");
      await expect(menuButton).toBeVisible();

      // Click menu to reveal links
      await menuButton.click();
      await expect(page.getByRole("link", { name: "Visualization" }).last()).toBeVisible();
      await expect(page.getByRole("link", { name: "Features" }).last()).toBeVisible();
    } else {
      // Desktop nav links are visible directly
      await expect(page.getByRole("link", { name: "Visualization" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Features" })).toBeVisible();
    }
  });
});
