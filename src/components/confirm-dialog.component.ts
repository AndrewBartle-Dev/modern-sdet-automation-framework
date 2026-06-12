import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Confirmation Dialog Component
 *
 * Reusable modal dialog that appears throughout the application when
 * a destructive action is triggered (cancel booking, delete event).
 * Composed into page objects rather than duplicating locators.
 *
 * Identified by role="dialog" and data-testid="confirm-dialog-yes".
 */
export class ConfirmDialogComponent {
  readonly dialog: Locator;
  readonly confirmButton: Locator;
  readonly dismissButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog');
    this.confirmButton = page.getByTestId('confirm-dialog-yes');
    this.dismissButton = this.dialog.getByRole('button', {
      name: 'Cancel',
      exact: true,
    });
  }

  async confirm(): Promise<void> {
    await expect(this.dialog).toBeVisible();
    await this.confirmButton.click();
  }

  async dismiss(): Promise<void> {
    await expect(this.dialog).toBeVisible();
    await this.dismissButton.click();
  }

  async verifyVisible(): Promise<void> {
    await expect(this.dialog).toBeVisible();
  }

  async verifyNotVisible(): Promise<void> {
    await expect(this.dialog).not.toBeVisible();
  }
}
