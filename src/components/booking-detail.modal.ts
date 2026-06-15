import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Admin Booking Detail Modal
 *
 * Rendered inline on the Manage Bookings page when clicking View on a row.
 * Does NOT navigate — URL stays at /admin/bookings.
 */
export class BookingDetailModal {
  readonly page: Page;
  readonly dialog: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dialog = page.getByRole('dialog');
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' });
  }

  /**
   * Gets a value by its label from the modal's label/value row structure.
   * Pattern: div.flex.items-start.justify-between > span.text-gray-500 (label)
   *                                               > span.font-medium (value)
   */
  private getValue(label: string): Locator {
    return this.dialog
      .locator('div.flex.items-start.justify-between')
      .filter({ has: this.page.locator('span.text-gray-500', { hasText: label }) })
      .locator('span.font-medium.text-gray-900.text-right');
  }

  getReference(): Locator {
    return this.getValue('Reference').locator('span.font-mono');
  }

  getStatus(): Locator {
    return this.getValue('Status').locator('span');
  }

  getEventTitle(): Locator {
    return this.getValue('Title');
  }

  getEventDate(): Locator {
    return this.getValue('Date');
  }

  getEventCity(): Locator {
    return this.getValue('City');
  }

  getCustomerName(): Locator {
    return this.getValue('Name');
  }

  getCustomerEmail(): Locator {
    return this.getValue('Email');
  }

  getCustomerPhone(): Locator {
    return this.getValue('Phone');
  }

  getTickets(): Locator {
    return this.getValue('Tickets');
  }

  getTotal(): Locator {
    return this.getValue('Total');
  }

  getBookedOn(): Locator {
    return this.getValue('Booked on');
  }

  async verifyModalVisible(bookingRef: string): Promise<void> {
    await expect(this.dialog).toBeVisible();
    await expect(
      this.dialog.getByRole('heading', { name: `Booking — ${bookingRef}` }),
    ).toBeVisible();
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

  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.dialog).not.toBeVisible();
  }
}
