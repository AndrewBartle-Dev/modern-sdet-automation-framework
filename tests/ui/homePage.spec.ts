// tests/ui/homePage.spec.ts

/**
 * Home Page UI Tests
 *
 * Covers the authenticated home page including navigation,
 * featured events section, and empty state behaviour.
 *
 * API calls are mocked via route interception to isolate UI behaviour
 * from real backend data. Auth token remains real as EventHub validates
 * JWTs server-side — a fake token would be rejected by the API.
 */

import { type Page } from '@playwright/test';
import { test, expect } from '../../src/fixtures/auth.fixture';
import { HomePage } from '../../src/pages/home.page';
import { mockEvents, mockAuthMe } from '../../src/data/ui-test-mock-data/home.mock';
import { mockRoute } from '../../src/utils/route.utils';

async function setupRouteMocks(
  page: Page,
  eventsData = mockEvents.threeEvents,
): Promise<void> {
  await mockRoute(page, '**/api/auth/me', mockAuthMe.authenticatedUser);
  await mockRoute(page, '**/api/events*', eventsData);
}

test.describe('Home Page', () => {

  test.describe('authenticated home page', () => {

    test.beforeEach(async ({ authenticatedPage }) => {
      await setupRouteMocks(authenticatedPage);
    });

    test('displays all home page content',
      { tag: ['@smoke', '@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        await homePage.verifyHomePageContent();
      }
    );

    test('displays authenticated user email in navigation',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        await homePage.verifyAuthenticatedHome(
          mockAuthMe.authenticatedUser.user.email,
        );
      }
    );

    test('displays admin menu options in navigation',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        await homePage.navigation.verifyAdminMenuItemsVisible();
      }
    );

  });

  test.describe('featured events section', () => {

    test.beforeEach(async ({ authenticatedPage }) => {
      await setupRouteMocks(authenticatedPage);
    });

    test('displays three featured event cards',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        await homePage.eventCards.verifyEventCardVisible('Tech Summit 2027');
        await homePage.eventCards.verifyEventCardVisible('Monsoon Music Night');
        await homePage.eventCards.verifyEventCardVisible('Dilli Diwali Mela');
      }
    );

    test('book now button is visible on event card',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        const bookNowButton = homePage.eventCards
          .getBookNowButtonByTitle('Tech Summit 2027');
        await expect(bookNowButton).toBeVisible();
      }
    );

  });

  test.describe('featured events — edge cases', () => {

    test('displays single event card when only one event exists',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        await setupRouteMocks(authenticatedPage, mockEvents.singleEvent);
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        await homePage.eventCards.verifyEventCardVisible('Tech Summit 2027');
        await homePage.eventCards.expectCardCountToBe(1);
      }
    );

    test('displays correct UI when no events are available',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        await setupRouteMocks(authenticatedPage, mockEvents.empty);
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        await expect(homePage.heroHeading).toBeVisible();
        await expect(homePage.ctaHeading).toBeVisible();
        await homePage.eventCards.expectCardCountToBe(0);
      }
    );

  });

});