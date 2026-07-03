// tests/e2e/admin-events.e2e.spec.ts

/**
 * Admin — Manage Events E2E
 *
 * Covers the admin event management journey: navigate to manage events,
 * create a new event, verify it appears, then delete it.
 *
 * Each test creates its own event and cleans up via afterEach so cleanup
 * always runs even on test failure. Static events are never touched.
 */

import { test} from '../../src/fixtures/auth.fixture';
import { expect} from "@playwright/test";
import { HomePage } from '../../src/pages/home.page';
import { ManageEventsPage } from '../../src/pages/manage-events.page';
import { EventCategory } from '../../src/api/contracts/api.contracts';

const TEST_EVENT = {
  title: `E2E Test Event ${Date.now()}`,
  city: 'Mumbai',
  venue: 'Test Venue, Bandra',
  date: '2028-12-01T10:00',
  price: '500',
  totalSeats: '100',
  category: 'Workshop',
};

test.describe('Admin — Manage Events E2E', () => {

  let createdEventId: number | null = null;

  test.afterEach(async ({ userClient }) => {
    if (createdEventId) {
      await userClient.events.delete(createdEventId);
      createdEventId = null;
    }
  });

  test('admin can navigate to manage events via the Admin menu',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage }) => {
      const homePage = new HomePage(authenticatedPage);
      await homePage.goto();

      await homePage.navigation.goToManageEvents();
      await expect(authenticatedPage).toHaveURL(/\/admin\/events/);

      const manageEventsPage = new ManageEventsPage(authenticatedPage);
      await expect(manageEventsPage.pageHeading).toBeVisible();
      await expect(manageEventsPage.allEventsHeading).toBeVisible();
      await expect(manageEventsPage.titleInput).toBeVisible();
      await expect(manageEventsPage.addEventButton).toBeVisible();
    }
  );

  test('admin can create a new event and see it in the events table',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage, userClient }) => {
      const manageEventsPage = new ManageEventsPage(authenticatedPage);
      await manageEventsPage.goto();

      await manageEventsPage.fillNewEventForm(TEST_EVENT);
      await manageEventsPage.submitNewEvent();
      await expect(manageEventsPage.getRowByTitle(TEST_EVENT.title)).toBeVisible();

      // Capture ID for cleanup — get the created event from the API
      const response = await userClient.events.getAll({ search: TEST_EVENT.title });
      const body = await response.json();
      createdEventId = body.data[0]?.id ?? null;
    }
  );

  test('admin can delete a user-created event and it is removed from the table',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage, userClient }) => {
      // Create via API — creation is not what this test covers
      const response = await userClient.events.create({
        title: TEST_EVENT.title,
        city: TEST_EVENT.city,
        venue: TEST_EVENT.venue,
        eventDate: new Date(TEST_EVENT.date).toISOString(),
        price: Number(TEST_EVENT.price),
        totalSeats: Number(TEST_EVENT.totalSeats),
        category: TEST_EVENT.category as EventCategory,
        description: '',
      });
      const body = await response.json();
      createdEventId = body.data.id;

      const manageEventsPage = new ManageEventsPage(authenticatedPage);
      await manageEventsPage.goto();
      await expect(manageEventsPage.getRowByTitle(TEST_EVENT.title)).toBeVisible();
      await manageEventsPage.deleteEvent(TEST_EVENT.title);
      await expect(manageEventsPage.getRowByTitle(TEST_EVENT.title)).not.toBeVisible();

      // Deleted via UI — no API cleanup needed
      createdEventId = null;
    }
  );

  test('static featured events show as read-only in the admin table',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage }) => {
      const manageEventsPage = new ManageEventsPage(authenticatedPage);
      await manageEventsPage.goto();

      const staticRow = manageEventsPage.getRowByTitle('Dilli Diwali Mela');
      await expect(staticRow).toBeVisible();
      await expect(staticRow.getByText('Read-only')).toBeVisible();
      await expect(staticRow.getByTestId('edit-event-btn')).not.toBeVisible();
      await expect(staticRow.getByTestId('delete-event-btn')).not.toBeVisible();
    }
  );

});
