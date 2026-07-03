import { type Locator, type Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

export class MyBookingsPage {
  readonly page: Page;
  readonly navigation: NavigationComponent;
  readonly confirmDialog: ConfirmDialogComponent;

  // page structure
  readonly pageHeading: Locator;
  readonly pageSubtitle: Locator;
  readonly clearAllBookingsButton: Locator;

  // booking cards
  readonly bookingCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = new NavigationComponent(page);
    this.confirmDialog = new ConfirmDialogComponent(page);

    this.pageHeading = page.getByRole('heading', {
      name: 'My Bookings',
      level: 1,
    });

    this.pageSubtitle = page.getByText(
      'View and manage all your ticket bookings',
      { exact: true },
    );

    this.clearAllBookingsButton = page.getByRole('button', {
      name: 'Clear all bookings',
    });

    this.bookingCards = page.getByTestId('booking-card');
  }

  async goto(): Promise<void> {
    await this.page.goto('/bookings');
  }

  /**
   * Returns a booking card scoped to a specific booking ref.
   * Booking refs are unique (e.g. B-LHS1OA) so this is the most
   * reliable way to scope card interactions when multiple bookings exist.
   */
  getCardByRef(bookingRef: string): Locator {
    return this.bookingCards.filter({ hasText: bookingRef });
  }

  /**
   * Returns a booking card scoped to a specific event title.
   * Use getCardByRef() when possible — title-based scoping is ambiguous
   * if the same event has been booked multiple times.
   */
  getCardByEventTitle(title: string): Locator {
    return this.bookingCards.filter({
      has: this.page.getByRole('heading', { name: title, level: 3 }),
    });
  }

  getViewDetailsButtonForCard(bookingRef: string): Locator {
    return this.getCardByRef(bookingRef).getByRole('button', {
      name: 'View Details',
    });
  }

  getCancelButtonForCard(bookingRef: string): Locator {
    return this.getCardByRef(bookingRef).getByTestId('cancel-booking-btn');
  }

  getStatusForCard(bookingRef: string): Locator {
    return this.getCardByRef(bookingRef).locator('.booking-ref').locator('~ span');
  }

  async viewDetailsForBooking(bookingRef: string): Promise<void> {
    await this.getViewDetailsButtonForCard(bookingRef).click();
  }

  async cancelBooking(bookingRef: string): Promise<void> {
    await this.getCancelButtonForCard(bookingRef).click();
    await this.confirmDialog.confirm();
  }

  async dismissCancelDialog(bookingRef: string): Promise<void> {
    await this.getCancelButtonForCard(bookingRef).click();
    await this.confirmDialog.dismiss();
  }

  async getBookingCardCount(): Promise<number> {
    return this.bookingCards.count();
  }

  async clearAllBookings(): Promise<void> {
    await this.clearAllBookingsButton.click();
  }

  /**
   * Returns the booking ref from the most recent card for a given event title.
   * Used when the booking ref is not known ahead of time — e.g. after completing
   * a booking and navigating to My Bookings to retrieve the ref for further actions.
   */
  async getLatestBookingRefForEvent(eventTitle: string): Promise<string> {
    const card = this.bookingCards.filter({ hasText: eventTitle }).first();
    const ref = await card.locator('.booking-ref').textContent();
    return ref!.trim();
  }
}
