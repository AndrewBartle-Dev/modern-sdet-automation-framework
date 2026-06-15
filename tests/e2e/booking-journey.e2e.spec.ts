// tests/e2e/booking-journey.e2e.spec.ts

/**
 * Booking Journey — E2E
 *
 * The core user journey: browse events → book → confirm → view booking → cancel.
 * This is the highest-value E2E flow in the application.
 *
 * Each test is fully self-contained:
 * - UI creates bookings where the booking flow itself is what is being tested
 * - afterEach cancels any booking created via the API so cleanup always runs,
 *   even if the test fails mid-journey
 * - No test assumes sandbox state from a sibling test
 */

import { test } from '../../src/fixtures/auth.fixture';
import { expect} from "@playwright/test";
import { HomePage } from '../../src/pages/home.page';
import { EventsPage } from '../../src/pages/events.page';
import { BookingPage } from '../../src/pages/book-event.page';
import { MyBookingsPage } from '../../src/pages/my-bookings.page';
import { BookingDetailPage } from '../../src/pages/booking-detail.page';
import { ENV } from '../../src/config/env';

// Static event always present in the sandbox
const DILLI_DIWALI = 'Dilli Diwali Mela';
const DILLI_DIWALI_ID = 3;

const CUSTOMER = {
  name: 'E2E Test User',
  email: ENV.TEST_EMAIL,
  phone: '9876543210',
};

test.describe('Booking Journey — E2E', () => {

  let createdBookingId: number | null = null;

  test.afterEach(async ({ userClient }) => {
    if (createdBookingId) {
      await userClient.bookings.cancel(createdBookingId);
      createdBookingId = null;
    }
  });

  test('user can browse events on the home page and navigate to the events page',
    { tag: ['@smoke', '@e2e', '@regression'] },
    async ({ authenticatedPage }) => {
      const homePage = new HomePage(authenticatedPage);
      await homePage.goto();

      await homePage.verifyHomePageContent();
      await homePage.eventCards.verifyFirstEventCardVisible();

      await homePage.navigation.goToEvents();
      await expect(authenticatedPage).toHaveURL(/\/events/);

      const eventsPage = new EventsPage(authenticatedPage);
      await eventsPage.verifyEventsPageVisible();
    }
  );

  test('user can navigate from an event card to the booking page',
    { tag: ['@smoke', '@e2e', '@regression'] },
    async ({ authenticatedPage }) => {
      const homePage = new HomePage(authenticatedPage);
      await homePage.goto();

      await homePage.eventCards.bookEventByTitle(DILLI_DIWALI);

      const bookingPage = new BookingPage(authenticatedPage);
      await expect(authenticatedPage).toHaveURL(/\/events\/\d+/);
      await bookingPage.verifyBookingPageVisible(DILLI_DIWALI);
    }
  );

  test('user can complete a booking and see the confirmation',
    { tag: ['@smoke', '@e2e', '@regression'] },
    async ({ authenticatedPage, userClient }) => {
      const homePage = new HomePage(authenticatedPage);
      await homePage.goto();
      await homePage.eventCards.bookEventByTitle(DILLI_DIWALI);

      const bookingPage = new BookingPage(authenticatedPage);
      await bookingPage.fillBookingForm(CUSTOMER.name, CUSTOMER.email, CUSTOMER.phone);
      await bookingPage.submitBooking();
      await bookingPage.verifyBookingConfirmed(CUSTOMER.name, 1, '$300');

      // Capture ID for cleanup
      const ref = await bookingPage.getBookingRef();
      const response = await userClient.bookings.getByRef(ref);
      const body = await response.json();
      createdBookingId = body.data.id;
    }
  );

  test('user can navigate to My Bookings after confirmation and see the new booking',
    { tag: ['@smoke', '@e2e', '@regression'] },
    async ({ authenticatedPage, userClient }) => {
      const homePage = new HomePage(authenticatedPage);
      await homePage.goto();
      await homePage.eventCards.bookEventByTitle(DILLI_DIWALI);

      const bookingPage = new BookingPage(authenticatedPage);
      await bookingPage.fillBookingForm(CUSTOMER.name, CUSTOMER.email, CUSTOMER.phone);
      await bookingPage.submitBooking();
      await expect(bookingPage.bookingConfirmedHeading).toBeVisible();

      // Capture ID for cleanup
      const ref = await bookingPage.getBookingRef();
      const response = await userClient.bookings.getByRef(ref);
      const body = await response.json();
      createdBookingId = body.data.id;

      await bookingPage.goToMyBookings();
      await expect(authenticatedPage).toHaveURL(/\/bookings/);

      const myBookingsPage = new MyBookingsPage(authenticatedPage);
      await myBookingsPage.verifyMyBookingsPageVisible();
      await myBookingsPage.verifyBookingCardVisible(ref);
    }
  );

  test('user can view booking detail from My Bookings',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage, userClient }) => {
      // Create booking via API — the booking flow is not what this test covers
      const response = await userClient.bookings.create({
        eventId: DILLI_DIWALI_ID,
        customerName: CUSTOMER.name,
        customerEmail: CUSTOMER.email,
        customerPhone: CUSTOMER.phone,
        quantity: 1,
      });
      const body = await response.json();
      createdBookingId = body.data.id;
      const bookingRef = body.data.bookingRef;

      const myBookingsPage = new MyBookingsPage(authenticatedPage);
      await myBookingsPage.goto();
      await myBookingsPage.viewDetailsForBooking(bookingRef);

      await expect(authenticatedPage).toHaveURL(/\/bookings\/\d+/);

      const detailPage = new BookingDetailPage(authenticatedPage);
      await detailPage.verifyBookingDetailPageVisible(DILLI_DIWALI);
      await detailPage.verifyCustomerDetails({
        name: CUSTOMER.name,
        email: CUSTOMER.email,
        phone: CUSTOMER.phone,
      });
    }
  );

  test('user can cancel a booking from the detail page',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage, userClient }) => {
      // Create booking via API — the cancel flow is what this test covers
      const response = await userClient.bookings.create({
        eventId: DILLI_DIWALI_ID,
        customerName: CUSTOMER.name,
        customerEmail: CUSTOMER.email,
        customerPhone: CUSTOMER.phone,
        quantity: 1,
      });
      const body = await response.json();
      createdBookingId = body.data.id;
      const bookingRef = body.data.bookingRef;

      const myBookingsPage = new MyBookingsPage(authenticatedPage);
      await myBookingsPage.goto();
      await myBookingsPage.viewDetailsForBooking(bookingRef);

      const detailPage = new BookingDetailPage(authenticatedPage);
      await detailPage.verifyBookingDetailPageVisible(DILLI_DIWALI);
      //await authenticatedPage.pause();
      await detailPage.cancelBooking();

      // Cancelled — no API cleanup needed
      createdBookingId = null;

      await expect(authenticatedPage).toHaveURL(/\/bookings/);
    }
  );

  test('user can cancel a booking directly from the My Bookings list',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage, userClient }) => {
      // Create booking via API — the cancel flow is what this test covers
      const response = await userClient.bookings.create({
        eventId: DILLI_DIWALI_ID,
        customerName: CUSTOMER.name,
        customerEmail: CUSTOMER.email,
        customerPhone: CUSTOMER.phone,
        quantity: 1,
      });
      const body = await response.json();
      createdBookingId = body.data.id;
      const bookingRef = body.data.bookingRef;

      const myBookingsPage = new MyBookingsPage(authenticatedPage);
      await myBookingsPage.goto();
      await myBookingsPage.cancelBooking(bookingRef);

      // Cancelled — no API cleanup needed
      createdBookingId = null;

      await expect(authenticatedPage).toHaveURL(/\/bookings/);
      await myBookingsPage.verifyBookingCardNotPresent(bookingRef);
    }
  );

});
