import { expect, type Locator, type Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

export class ManageBookingsPage {
  readonly page: Page;
  readonly navigation: NavigationComponent;
  readonly confirmDialog: ConfirmDialogComponent;

  // page structure
  readonly pageHeading: Locator;
  readonly statusFilter: Locator;

  // table
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = new NavigationComponent(page);
    this.confirmDialog = new ConfirmDialogComponent(page);

    this.pageHeading = page.getByRole('heading', {
      name: 'Manage Bookings',
      level: 1,
    });

    this.statusFilter = page.getByRole('combobox');
    this.tableRows = page.locator('tbody tr');
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/bookings');
  }

  async verifyManageBookingsPageVisible(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.statusFilter).toBeVisible();
  }

  getRowByRef(bookingRef: string): Locator {
    return this.tableRows.filter({ hasText: bookingRef });
  }

  getViewButtonForBooking(bookingRef: string): Locator {
    return this.getRowByRef(bookingRef).getByRole('button', { name: 'View' });
  }

  getCancelButtonForBooking(bookingRef: string): Locator {
    return this.getRowByRef(bookingRef).getByRole('button', { name: 'Cancel' });
  }

  async filterByStatus(status: 'confirmed' | 'cancelled' | ''): Promise<void> {
    await this.statusFilter.selectOption(status);
  }

  async viewBooking(bookingRef: string): Promise<void> {
    await this.getViewButtonForBooking(bookingRef).click();
  }

  async cancelBooking(bookingRef: string): Promise<void> {
    await this.getCancelButtonForBooking(bookingRef).click();
    await this.confirmDialog.confirm();
  }

  async dismissCancelDialog(bookingRef: string): Promise<void> {
    await this.getCancelButtonForBooking(bookingRef).click();
    await this.confirmDialog.dismiss();
  }

  async verifyBookingInTable(bookingRef: string): Promise<void> {
    await expect(this.getRowByRef(bookingRef)).toBeVisible();
  }

  async verifyBookingNotInTable(bookingRef: string): Promise<void> {
    await expect(this.getRowByRef(bookingRef)).not.toBeVisible();
  }

  async verifyBookingStatus(bookingRef: string, status: string): Promise<void> {
    await expect(this.getRowByRef(bookingRef).getByText(status)).toBeVisible();
  }

  async getTotalBookingsCount(): Promise<number> {
    return this.tableRows.count();
  }

  async verifyTotalCountText(count: number): Promise<void> {
    await expect(
      this.page.getByText(new RegExp(`${count} total booking`)),
    ).toBeVisible();
  }
}
