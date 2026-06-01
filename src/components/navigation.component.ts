import { expect, type Locator, type Page } from "@playwright/test";

export class NavigationComponent {
  readonly page: Page;

  readonly navigation: Locator;
  readonly logoLink: Locator;
  readonly homeLink: Locator;
  readonly eventsLink: Locator;
  readonly bookingsLink: Locator;
  readonly apiDocsLink: Locator;
  readonly adminButton: Locator;
  readonly logoutButton: Locator;
  readonly manageEventsMenuItem: Locator;
  readonly manageBookingsMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navigation = page.getByRole("navigation");

    this.logoLink = this.navigation.getByRole("link", { name: "EventHub" });
    this.homeLink = this.navigation.getByTestId("nav-home");
    this.eventsLink = this.navigation.getByTestId("nav-events");
    this.bookingsLink = this.navigation.getByTestId("nav-bookings");
    this.apiDocsLink = this.navigation.getByRole("link", { name: "API Docs" });
    this.adminButton = this.navigation.getByRole("button", { name: /Admin/ });
    this.logoutButton = this.navigation.getByTestId("logout-btn");

    this.manageEventsMenuItem = this.navigation.getByRole("link", {
      name: "Manage Events",
      exact: true,
    });

    this.manageBookingsMenuItem = this.navigation.getByRole("link", {
      name: "Manage Bookings",
      exact: true,
    });
  }

  userEmail(email: string): Locator {
    return this.page.getByTestId("user-email-display");
  }

  async openAdminMenu(): Promise<void> {
    await this.adminButton.click();
  }

  async verifyAdminMenuItemsVisible(): Promise<void> {
    await this.openAdminMenu();
    await expect(this.manageEventsMenuItem).toBeVisible();
    await expect(this.manageBookingsMenuItem).toBeVisible();
  }

  async goToManageEvents(): Promise<void> {
    await this.openAdminMenu();
    await this.manageEventsMenuItem.click();
  }

  async goToManageBookings(): Promise<void> {
    await this.openAdminMenu();
    await this.manageBookingsMenuItem.click();
  }

  async verifyAuthenticatedNavigation(email: string): Promise<void> {
    await expect(this.navigation).toBeVisible();
    await expect(this.logoLink).toBeVisible();
    await expect(this.homeLink).toBeVisible();
    await expect(this.eventsLink).toBeVisible();
    await expect(this.bookingsLink).toBeVisible();
    await expect(this.apiDocsLink).toBeVisible();
    await expect(this.adminButton).toBeVisible();
    await expect(this.userEmail(email)).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
