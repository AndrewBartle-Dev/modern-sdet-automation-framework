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
      await expect(homePage.heroHeading).toBeVisible();
      await expect(homePage.heroDescription).toBeVisible();
      await expect(homePage.browseEventsLink).toBeVisible();
      await expect(homePage.myBookingsHeroLink).toBeVisible();
      await expect(homePage.featuredHeading).toBeVisible();
      await expect(homePage.featuredSubtitle).toBeVisible();
      await expect(homePage.viewAllEventsLink).toBeVisible();
      await expect(homePage.ctaHeading).toBeVisible();
      await expect(homePage.ctaDescription).toBeVisible();
      await expect(homePage.exploreAllEventsButton).toBeVisible();
    }
  );

  test('authenticated user email is displayed in navigation after login',
    { tag: ['@e2e', '@regression'] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(ENV.TEST_EMAIL, ENV.TEST_PASSWORD);

      const homePage = new HomePage(page);
      const nav = homePage.navigation;
      await expect(nav.navigation).toBeVisible();
      await expect(nav.logoLink).toBeVisible();
      await expect(nav.homeLink).toBeVisible();
      await expect(nav.eventsLink).toBeVisible();
      await expect(nav.bookingsLink).toBeVisible();
      await expect(nav.apiDocsLink).toBeVisible();
      await expect(nav.adminButton).toBeVisible();
      await expect(nav.getUserEmail()).toHaveText(ENV.TEST_EMAIL);
      await expect(nav.logoutButton).toBeVisible();
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
