import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./src/config/env";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",

  /* Global setup — authenticates once before the suite starts */
  globalSetup: './global-setup.ts',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // process.env.CI is a GitHub Actions built-in — not added to ENV
  // because getRequiredEnv would throw in local environments where CI is not set
  forbidOnly: !!process.env.CI,

  /* 1 retry on CI and locally — enough to rule out transient infrastructure issues
     without masking genuinely flaky tests */
  retries: process.env.CI ? 1 : 0,

  /* Use 50% of available cores on CI for parallelism without overloading the runner */
  workers: process.env.CI ? 2 : undefined,

  /* Global test timeout */
  timeout: 30_000,

  /* Global assertion timeout */
  expect: {
    timeout: 5_000,
  },

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], ["allure-playwright"]],

  /* Shared settings for all projects */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: ENV.BASE_URL,

    /* Collect trace on first retry for debugging CI failures */
    trace: process.env.CI ? "on-first-retry" : "off",

    /* Capture screenshot on failure for debugging */
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: !!process.env.CI,
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        headless: !!process.env.CI,
      },
    },
  ],
});