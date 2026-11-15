import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "test-results/playwright-results.json" }]],
  use: {
    baseURL: "http://localhost:3005",
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-viewport",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npx next start -p 3005",
    port: 3005,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
