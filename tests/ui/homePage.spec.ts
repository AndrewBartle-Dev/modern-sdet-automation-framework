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

import { type Page, expect} from '@playwright/test';
import { test } from '../../src/fixtures/auth.fixture';
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

    test('displays hero and featured sections',
      { tag: ['@smoke', '@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
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

    test('displays authenticated user details in navigation',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        const nav = homePage.navigation;
        await expect(nav.navigation).toBeVisible();
        await expect(nav.logoLink).toBeVisible();
        await expect(nav.homeLink).toBeVisible();
        await expect(nav.eventsLink).toBeVisible();
        await expect(nav.bookingsLink).toBeVisible();
        await expect(nav.apiDocsLink).toBeVisible();
        await expect(nav.adminButton).toBeVisible();
        await expect(nav.getUserEmail()).toHaveText(mockAuthMe.authenticatedUser.user.email);
        await expect(nav.logoutButton).toBeVisible();
      }
    );

    test('displays footer content',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        await expect(homePage.footer.footer).toBeVisible();
        await expect(homePage.footer.academyHeading).toBeVisible();
        await expect(homePage.footer.popularCoursesHeading).toBeVisible();
        await expect(homePage.footer.hiringPlatformHeading).toBeVisible();
        await expect(homePage.footer.practiceAppHeading).toBeVisible();
      }
    );

    test('displays admin menu options in navigation',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const homePage = new HomePage(authenticatedPage);
        await homePage.goto();
        await homePage.navigation.openAdminMenu();
        await expect(homePage.navigation.manageEventsMenuItem).toBeVisible();
        await expect(homePage.navigation.manageBookingsMenuItem).toBeVisible();
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
        await expect(homePage.eventCards.getEventCardByTitle('Tech Summit 2027')).toBeVisible();
        await expect(homePage.eventCards.getEventCardByTitle('Monsoon Music Night')).toBeVisible();
        await expect(homePage.eventCards.getEventCardByTitle('Dilli Diwali Mela')).toBeVisible();
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
        await expect(homePage.eventCards.getEventCardByTitle('Tech Summit 2027')).toBeVisible();
        await expect(homePage.eventCards.eventCards).toHaveCount(1);
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
        await expect(homePage.eventCards.eventCards).toHaveCount(0);
      }
    );

  });

});