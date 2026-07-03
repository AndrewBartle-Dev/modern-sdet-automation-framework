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
import { expect } from "@playwright/test";
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
      await expect(homePage.eventCards.eventCards.first()).toBeVisible();

      await homePage.navigation.goToEvents();
      await expect(authenticatedPage).toHaveURL(/\/events/);

      const eventsPage = new EventsPage(authenticatedPage);
      await expect(eventsPage.pageHeading).toBeVisible();
      await expect(eventsPage.pageSubtitle).toBeVisible();
      await expect(eventsPage.searchInput).toBeVisible();
      await expect(eventsPage.categorySelect).toBeVisible();
      await expect(eventsPage.citySelect).toBeVisible();
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
      await expect(bookingPage.eventTitle(DILLI_DIWALI)).toBeVisible();
      await expect(bookingPage.aboutHeading).toBeVisible();
      await expect(bookingPage.ticketsHeading).toBeVisible();
      await expect(bookingPage.fullNameInput).toBeVisible();
      await expect(bookingPage.emailInput).toBeVisible();
      await expect(bookingPage.phoneInput).toBeVisible();
      await expect(bookingPage.decrementQuantityButton).toBeVisible();
      await expect(bookingPage.incrementQuantityButton).toBeVisible();
      await expect(bookingPage.confirmBookingButton).toBeVisible();
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

      await expect(bookingPage.bookingConfirmedHeading).toBeVisible();
      await expect(bookingPage.ticketsReservedText).toBeVisible();
      await expect(bookingPage.bookingRefValue).toBeVisible();
      await expect(bookingPage.getConfirmationValue('Customer')).toHaveText(CUSTOMER.name);
      await expect(bookingPage.getConfirmationValue('Tickets')).toHaveText('1');
      await expect(bookingPage.getConfirmationValue('Total')).toHaveText('$300');
      await expect(bookingPage.viewMyBookingsButton).toBeVisible();
      await expect(bookingPage.browseMoreEventsButton).toBeVisible();

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
      await expect(myBookingsPage.pageHeading).toBeVisible();
      await expect(myBookingsPage.pageSubtitle).toBeVisible();
      await expect(myBookingsPage.getCardByRef(ref)).toBeVisible();
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
      await expect(detailPage.eventTitle).toHaveText(DILLI_DIWALI);
      await expect(detailPage.eventDetailsHeading).toBeVisible();
      await expect(detailPage.customerDetailsHeading).toBeVisible();
      await expect(detailPage.paymentSummaryHeading).toBeVisible();
      await expect(detailPage.bookingInformationHeading).toBeVisible();
      await expect(detailPage.cancelBookingButton).toBeVisible();
      await expect(detailPage.backToMyBookingsButton).toBeVisible();
      await expect(detailPage.getCustomerName()).toHaveText(CUSTOMER.name);
      await expect(detailPage.getCustomerEmail()).toHaveText(CUSTOMER.email);
      await expect(detailPage.getCustomerPhone()).toHaveText(CUSTOMER.phone);
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
      await expect(detailPage.eventTitle).toHaveText(DILLI_DIWALI);
      await expect(detailPage.eventDetailsHeading).toBeVisible();
      await expect(detailPage.customerDetailsHeading).toBeVisible();
      await expect(detailPage.paymentSummaryHeading).toBeVisible();
      await expect(detailPage.bookingInformationHeading).toBeVisible();
      await expect(detailPage.cancelBookingButton).toBeVisible();
      await expect(detailPage.backToMyBookingsButton).toBeVisible();
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
      await expect(myBookingsPage.getCardByRef(bookingRef)).not.toBeVisible();
    }
  );

});
