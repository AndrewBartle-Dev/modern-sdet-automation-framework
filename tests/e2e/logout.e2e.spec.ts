// tests/e2e/logout.e2e.spec.ts

/**
 * Logout E2E Tests
 *
 * Covers the full logout flow: authenticated state → click logout →
 * redirected to login → token cleared from localStorage.
 *
 * Uses the authenticatedPage fixture for auth setup so the test
 * starts from an authenticated state without repeating the login flow.
 */

import { test } from '../../src/fixtures/auth.fixture';
import { expect} from "@playwright/test";
import { HomePage } from '../../src/pages/home.page';
import { LoginPage } from '../../src/pages/login.page';

test.describe('Logout — E2E', () => {

  test('authenticated user can log out and is redirected to login page',
    { tag: ['@smoke', '@e2e', '@regression'] },
    async ({ authenticatedPage }) => {
      const homePage = new HomePage(authenticatedPage);
      await homePage.goto();

      await homePage.navigation.logout();

      await expect(authenticatedPage).toHaveURL(/\/login/);

      const loginPage = new LoginPage(authenticatedPage);
      await loginPage.verifyLoginPageContent();
      await loginPage.verifyLoginFormVisible();
    }
  );

  test('auth token is removed from localStorage after logout',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage }) => {
      const homePage = new HomePage(authenticatedPage);
      await homePage.goto();

      await homePage.navigation.logout();

      const token = await authenticatedPage.evaluate(() =>
        window.localStorage.getItem('eventhub_token'),
      );

      expect(token).toBeNull();
    }
  );
});
