import { expect, type Locator, type Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component';
import { EventCardComponent } from '../components/event-card.component';

export class EventsPage {
  readonly page: Page;
  readonly navigation: NavigationComponent;
  readonly eventCards: EventCardComponent;

  readonly pageHeading: Locator;
  readonly pageSubtitle: Locator;
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly citySelect: Locator;
  readonly sandboxInfoBanner: Locator;
  readonly addNewEventButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = new NavigationComponent(page);
    this.eventCards = new EventCardComponent(page);

    this.pageHeading = page.getByRole('heading', {
      name: 'Upcoming Events',
      level: 1,
    });

    this.pageSubtitle = page.getByText('Find your next unforgettable experience', {
      exact: true,
    });

    this.searchInput = page.getByPlaceholder('Search events, venues…');

    // No data-testid on selects — scoped by position
    this.categorySelect = page.getByRole('combobox').first();
    this.citySelect = page.getByRole('combobox').nth(1);

    this.sandboxInfoBanner = page.getByText(
      /Your sandbox holds up to.*9 bookings.*and you can create up to.*6 custom events/,
    );

    this.addNewEventButton = page.getByRole('button', { name: 'Add New Event' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/events');
  }

  async verifyEventsPageVisible(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.pageSubtitle).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.categorySelect).toBeVisible();
    await expect(this.citySelect).toBeVisible();
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption(category);
  }

  async filterByCity(city: string): Promise<void> {
    await this.citySelect.selectOption(city);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  async verifySearchInputValue(value: string): Promise<void> {
    await expect(this.searchInput).toHaveValue(value);
  }

  async verifyCategoryFilterValue(value: string): Promise<void> {
    await expect(this.categorySelect).toHaveValue(value);
  }

  async verifyCityFilterValue(value: string): Promise<void> {
    await expect(this.citySelect).toHaveValue(value);
  }
}
