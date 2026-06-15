// tests/e2e/login.e2e.spec.ts

/**
 * Login E2E Tests
 *
 * Drives the full login flow through the browser UI using real credentials
 * and the real API — no route mocking, no token injection.
 *
 * Uses the base Playwright `test` fixture (not the auth fixture) so that
 * login is exercised end-to-end from an unauthenticated state.
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { HomePage } from '../../src/pages/home.page';
import { ENV } from '../../src/config/env';

test.describe('Login — E2E', () => {

  test('displays login page content',
    { tag: ['@e2e', '@regression'] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.verifyLoginPageContent();
      await loginPage.verifyLoginFormVisible();
    }
  );

  test('user can log in with valid credentials and is redirected to home',
    { tag: ['@smoke', '@e2e', '@regression'] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(ENV.TEST_EMAIL, ENV.TEST_PASSWORD);

      const homePage = new HomePage(page);
      await expect(page).toHaveURL('/');
      await homePage.verifyHomePageContent();
    }
  );

  test('authenticated user email is displayed in navigation after login',
    { tag: ['@e2e', '@regression'] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(ENV.TEST_EMAIL, ENV.TEST_PASSWORD);

      const homePage = new HomePage(page);
      await homePage.navigation.verifyAuthenticatedNavigation(ENV.TEST_EMAIL);
    }
  );

  test('unauthenticated user is redirected to login when accessing a protected page',
    { tag: ['@e2e', '@regression'] },
    async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/login/);
    }
  );

});
