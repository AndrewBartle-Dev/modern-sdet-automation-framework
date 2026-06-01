import { test } from "../../src/fixtures/auth.fixture";
import { HomePage } from "../../src/pages/home.page";
import { ENV } from "../../src/config/env";

test.describe("Home Page", () => {
  test(
    "should display authenticated home page content",
    { tag: ["@ui"] },
    async ({ authenticatedPage }) => {
      const homePage = new HomePage(authenticatedPage);

      await homePage.goto();

      await homePage.verifyAuthenticatedHome(ENV.TEST_EMAIL);
    },
  );

  test(
    "should display admin menu options",
    { tag: ["@ui"] },
    async ({ authenticatedPage }) => {
      const homePage = new HomePage(authenticatedPage);

      await homePage.goto();

      await homePage.navigation.verifyAdminMenuItemsVisible();
    },
  );
});
