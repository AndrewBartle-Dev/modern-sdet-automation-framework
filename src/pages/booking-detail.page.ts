import { expect, type Locator, type Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

export class BookingDetailPage {
  readonly page: Page;
  readonly navigation: NavigationComponent;
  readonly confirmDialog: ConfirmDialogComponent;

  // header
  readonly eventTitle: Locator;
  readonly cancelBookingButton: Locator;
  readonly backToMyBookingsButton: Locator;

  // section headings
  readonly eventDetailsHeading: Locator;
  readonly customerDetailsHeading: Locator;
  readonly paymentSummaryHeading: Locator;
  readonly refundHeading: Locator;
  readonly bookingInformationHeading: Locator;

  // refund
  readonly checkRefundButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = new NavigationComponent(page);
    this.confirmDialog = new ConfirmDialogComponent(page);

    this.eventTitle = page.getByRole('heading', { level: 1 });

    this.cancelBookingButton = page.locator('main').getByRole('button', {
      name: 'Cancel Booking',
    });

    this.backToMyBookingsButton = page.getByRole('button', {
      name: '← Back to My Bookings',
    });

    this.eventDetailsHeading = page.getByRole('heading', {
      name: 'Event Details',
      level: 2,
    });

    this.customerDetailsHeading = page.getByRole('heading', {
      name: 'Customer Details',
      level: 2,
    });

    this.paymentSummaryHeading = page.getByRole('heading', {
      name: 'Payment Summary',
      level: 2,
    });

    this.refundHeading = page.getByRole('heading', {
      name: 'Refund',
      level: 2,
    });

    this.bookingInformationHeading = page.getByRole('heading', {
      name: 'Booking Information',
      level: 2,
    });

    this.checkRefundButton = page.getByTestId('check-refund-btn');
  }

  private getDetailValue(sectionHeading: string, label: string): Locator {
    return this.page
      .locator('div.bg-white.rounded-2xl')
      .filter({
        has: this.page.getByRole('heading', { name: sectionHeading, level: 2 }),
      })
      .locator('div.flex.justify-between')
      .filter({ hasText: label })
      .locator('span.font-medium');
  }

  getEventName(): Locator { return this.getDetailValue('Event Details', 'Event'); }
  getEventCategory(): Locator { return this.getDetailValue('Event Details', 'Category'); }
  getEventDate(): Locator { return this.getDetailValue('Event Details', 'Date'); }
  getEventVenue(): Locator { return this.getDetailValue('Event Details', 'Venue'); }
  getEventCity(): Locator { return this.getDetailValue('Event Details', 'City'); }
  getCustomerName(): Locator { return this.getDetailValue('Customer Details', 'Name'); }
  getCustomerEmail(): Locator { return this.getDetailValue('Customer Details', 'Email'); }
  getCustomerPhone(): Locator { return this.getDetailValue('Customer Details', 'Phone'); }
  getTicketCount(): Locator { return this.getDetailValue('Payment Summary', 'Tickets'); }
  getPricePerTicket(): Locator { return this.getDetailValue('Payment Summary', 'Price per ticket'); }
  getBookedOn(): Locator { return this.getDetailValue('Booking Information', 'Booked on'); }
  getBookingId(): Locator { return this.getDetailValue('Booking Information', 'Booking ID'); }

  async verifyBookingDetailPageVisible(eventTitle: string): Promise<void> {
    await expect(this.eventTitle).toHaveText(eventTitle);
    await expect(this.eventDetailsHeading).toBeVisible();
    await expect(this.customerDetailsHeading).toBeVisible();
    await expect(this.paymentSummaryHeading).toBeVisible();
    await expect(this.bookingInformationHeading).toBeVisible();
    await expect(this.cancelBookingButton).toBeVisible();
    await expect(this.backToMyBookingsButton).toBeVisible();
  }

  async verifyEventDetails(details: {
    event: string;
    category: string;
    venue: string;
    city: string;
  }): Promise<void> {
    await expect(this.getEventName()).toHaveText(details.event);
    await expect(this.getEventCategory()).toHaveText(details.category);
    await expect(this.getEventVenue()).toHaveText(details.venue);
    await expect(this.getEventCity()).toHaveText(details.city);
  }

  async verifyCustomerDetails(details: {
    name: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await expect(this.getCustomerName()).toHaveText(details.name);
    await expect(this.getCustomerEmail()).toHaveText(details.email);
    await expect(this.getCustomerPhone()).toHaveText(details.phone);
  }

  async goBackToMyBookings(): Promise<void> {
    await this.backToMyBookingsButton.click();
  }

  async cancelBooking(): Promise<void> {
    await this.cancelBookingButton.click();
    await this.confirmDialog.confirm();
  }
}
