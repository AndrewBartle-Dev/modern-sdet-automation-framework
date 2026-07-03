import { expect, test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { ENV } from "../../src/config/env";

test.describe("Login Page", () => {
  test(
    "should display login page content and form fields",
    { tag: ["@ui"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await expect(loginPage.heroHeading).toBeVisible();
      await expect(loginPage.heroDescription).toBeVisible();
      await expect(loginPage.apiDocsLink).toBeVisible();
      await expect(loginPage.appPreviewImage).toBeVisible();
      await expect(loginPage.signInHeading).toBeVisible();
      await expect(loginPage.signInSubtitle).toBeVisible();
      await expect(loginPage.registerLink).toBeVisible();
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
    },
  );

  test(
    "should allow a user to log in with valid credentials",
    { tag: ["@ui"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.login(ENV.TEST_EMAIL, ENV.TEST_PASSWORD);

      // Temporary assertion until you build HomePage / Navigation component
      await page.waitForURL(/eventhub\.rahulshettyacademy\.com\/?/);
    },
  );
});
