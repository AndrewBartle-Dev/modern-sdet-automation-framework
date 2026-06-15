// tests/e2e/admin-bookings.e2e.spec.ts

/**
 * Admin — Manage Bookings E2E
 *
 * Covers the admin booking management journey: navigate to manage bookings,
 * view a booking detail modal, and cancel a booking from the admin table.
 *
 * Each test creates its booking via the API — the booking itself is just
 * precondition state, not what is being tested. afterEach cancels any
 * uncleaned booking so cleanup always runs even on test failure.
 */

import { test } from '../../src/fixtures/auth.fixture';
import { expect} from "@playwright/test";
import { HomePage } from '../../src/pages/home.page';
import { ManageBookingsPage } from '../../src/pages/manage-bookings.page';
import { BookingDetailModal } from '../../src/components/booking-detail.modal';
import { ENV } from '../../src/config/env';

const DILLI_DIWALI_ID = 3;
const DILLI_DIWALI = 'Dilli Diwali Mela';

const CUSTOMER = {
  name: 'E2E Admin Test User',
  email: ENV.TEST_EMAIL,
  phone: '9876543210',
};

test.describe('Admin — Manage Bookings E2E', () => {

  let createdBookingId: number | null = null;

  test.afterEach(async ({ userClient }) => {
    if (createdBookingId) {
      await userClient.bookings.cancel(createdBookingId);
      createdBookingId = null;
    }
  });

  test('admin can navigate to manage bookings via the Admin menu',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage }) => {
      const homePage = new HomePage(authenticatedPage);
      await homePage.goto();

      await homePage.navigation.goToManageBookings();

      await expect(authenticatedPage).toHaveURL(/\/admin\/bookings/);

      const manageBookingsPage = new ManageBookingsPage(authenticatedPage);
      await manageBookingsPage.verifyManageBookingsPageVisible();
    }
  );

  test('admin can view a booking detail from the manage bookings table',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage, userClient }) => {
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

      const manageBookingsPage = new ManageBookingsPage(authenticatedPage);
      await manageBookingsPage.goto();
      await manageBookingsPage.verifyBookingInTable(bookingRef);
      await manageBookingsPage.viewBooking(bookingRef);

      const modal = new BookingDetailModal(authenticatedPage);
      await modal.verifyModalVisible(bookingRef);
      await modal.verifyCustomerDetails({
        name: CUSTOMER.name,
        email: CUSTOMER.email,
        phone: CUSTOMER.phone,
      });
    }
  );

  test('admin can cancel a booking from the manage bookings table',
    { tag: ['@e2e', '@regression'] },
    async ({ authenticatedPage, userClient }) => {
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

      const manageBookingsPage = new ManageBookingsPage(authenticatedPage);
      await manageBookingsPage.goto();
      await manageBookingsPage.cancelBooking(bookingRef);

      // Cancelled via UI — no API cleanup needed
      createdBookingId = null;

      await manageBookingsPage.verifyBookingNotInTable(bookingRef);
    }
  );

});
