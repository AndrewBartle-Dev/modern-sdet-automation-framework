import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { ENV } from "../../src/config/env";

test.describe("Login Page", () => {
  test(
    "should display login page content and form fields",
    { tag: ["@ui"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.verifyLoginPageContent();
      await loginPage.verifyLoginFormVisible();
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
