// tests/ui/bookingPage.spec.ts

/**
 * Booking Page UI Tests
 *
 * Covers the booking form, quantity controls, form validation,
 * booking confirmation state, and error handling.
 *
 * API calls are mocked via route interception to isolate UI behaviour
 * from real backend data. Auth token remains real as EventHub validates
 * JWTs server-side — a fake token would be rejected by the API.
 */

import { type Page, expect } from '@playwright/test';
import { test } from '../../src/fixtures/auth.fixture';
import { BookingPage } from '../../src/pages/book-event.page';
import { mockBookingEvent, mockBookingResponse } from '../../src/data/ui-test-mock-data/booking.mock';
import { mockRoute } from '../../src/utils/route.utils';

const TEST_EVENT_ID = 1;

async function setupRouteMocks(
  page: Page,
  eventData = mockBookingEvent.techSummit,
): Promise<void> {
  await mockRoute(page, `**/api/events/${TEST_EVENT_ID}`, eventData);
}

test.describe('Booking Page', () => {

  test.describe('page elements', () => {

    test.beforeEach(async ({ authenticatedPage }) => {
      await setupRouteMocks(authenticatedPage);
    });

    test('displays all booking page elements',
      { tag: ['@smoke', '@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const bookingPage = new BookingPage(authenticatedPage);
        await bookingPage.goto(TEST_EVENT_ID);

        const title = mockBookingEvent.techSummit.data.title;
        await expect(bookingPage.eventTitle(title)).toBeVisible();
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

    test('displays event title in heading',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const bookingPage = new BookingPage(authenticatedPage);
        await bookingPage.goto(TEST_EVENT_ID);

        await expect(
          bookingPage.eventTitle(mockBookingEvent.techSummit.data.title),
        ).toBeVisible();
      }
    );

  });

  test.describe('booking form', () => {

    test.beforeEach(async ({ authenticatedPage }) => {
      await setupRouteMocks(authenticatedPage);
    });

    test('user can fill in booking form',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const bookingPage = new BookingPage(authenticatedPage);
        await bookingPage.goto(TEST_EVENT_ID);

        await bookingPage.fillBookingForm(
          'QA Automation User',
          'test@mockuser.com',
          '9876543210',
        );

        await expect(bookingPage.fullNameInput).toHaveValue('QA Automation User');
        await expect(bookingPage.emailInput).toHaveValue('test@mockuser.com');
        await expect(bookingPage.phoneInput).toHaveValue('9876543210');
      }
    );

    test('user can increment ticket quantity',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const bookingPage = new BookingPage(authenticatedPage);
        await bookingPage.goto(TEST_EVENT_ID);

        await bookingPage.increaseQuantity(2);

        expect(await bookingPage.getTicketCount()).toBe(3);
      }
    );

    test('user can decrement ticket quantity',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        const bookingPage = new BookingPage(authenticatedPage);
        await bookingPage.goto(TEST_EVENT_ID);

        await bookingPage.increaseQuantity(2);
        await bookingPage.decreaseQuantity(1);

        expect(await bookingPage.getTicketCount()).toBe(2);
      }
    );

  });

  test.describe('booking confirmation', () => {

    test('displays booking confirmation after successful submission',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        await setupRouteMocks(authenticatedPage);
        await mockRoute(
          authenticatedPage,
          '**/api/bookings',
          mockBookingResponse.confirmed,
          201,
        );

        const bookingPage = new BookingPage(authenticatedPage);
        await bookingPage.goto(TEST_EVENT_ID);
        const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

        await bookingPage.fillBookingForm(
          mockBookingResponse.confirmed.data.customerName,
          mockBookingResponse.confirmed.data.customerEmail,
          mockBookingResponse.confirmed.data.customerPhone,
        );

        await bookingPage.submitBooking();

        await expect(bookingPage.bookingConfirmedHeading).toBeVisible();
        await expect(bookingPage.ticketsReservedText).toBeVisible();
        await expect(bookingPage.bookingRefValue).toBeVisible();
        await expect(bookingPage.getConfirmationValue('Customer')).toHaveText(
          mockBookingResponse.confirmed.data.customerName,
        );
        await expect(bookingPage.getConfirmationValue('Tickets')).toHaveText(
          mockBookingResponse.confirmed.data.quantity.toString(),
        );
        await expect(bookingPage.getConfirmationValue('Total')).toHaveText(
          formatCurrency(mockBookingResponse.confirmed.data.totalPrice),
        );
        await expect(bookingPage.viewMyBookingsButton).toBeVisible();
        await expect(bookingPage.browseMoreEventsButton).toBeVisible();
      }
    );

  });

  test.describe('error states', () => {

    test('displays error when booking fails due to insufficient seats',
      { tag: ['@ui', '@regression'] },
      async ({ authenticatedPage }) => {
        await setupRouteMocks(authenticatedPage);
        await mockRoute(
          authenticatedPage,
          '**/api/bookings',
          mockBookingResponse.insufficientSeats,
          400,
        );

        const bookingPage = new BookingPage(authenticatedPage);
        await bookingPage.goto(TEST_EVENT_ID);

        await bookingPage.fillBookingForm(
          'QA Automation User',
          'test@mockuser.com',
          '9876543210',
        );
        await bookingPage.submitBooking();

        await expect(bookingPage.seatValidationError).toBeVisible();
      }
    );

  });

});
