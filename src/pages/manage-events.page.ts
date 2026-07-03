import { type Locator, type Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

export class ManageEventsPage {
  readonly page: Page;
  readonly navigation: NavigationComponent;
  readonly confirmDialog: ConfirmDialogComponent;

  // page structure
  readonly pageHeading: Locator;
  readonly allEventsHeading: Locator;
  readonly sandboxInfoBanner: Locator;

  // new event form
  readonly eventForm: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly categorySelect: Locator;
  readonly cityInput: Locator;
  readonly venueInput: Locator;
  readonly dateInput: Locator;
  readonly priceInput: Locator;
  readonly totalSeatsInput: Locator;
  readonly imageUrlInput: Locator;
  readonly addEventButton: Locator;

  // validation errors
  readonly titleRequiredError: Locator;
  readonly venueRequiredError: Locator;
  readonly dateRequiredError: Locator;
  readonly priceRequiredError: Locator;
  readonly cityRequiredError: Locator;
  readonly seatsRequiredError: Locator;

  // events table
  readonly eventTableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = new NavigationComponent(page);
    this.confirmDialog = new ConfirmDialogComponent(page);

    this.pageHeading = page.getByRole('heading', { name: '+ New Event', level: 2 });
    this.allEventsHeading = page.getByRole('heading', { name: 'All Events', level: 2 });

    this.sandboxInfoBanner = page.getByText(
      /You can add up to.*6 events.*Once the limit is reached/,
    );

    this.eventForm = page.getByTestId('admin-event-form');
    this.titleInput = page.getByTestId('event-title-input');
    this.descriptionInput = page.getByPlaceholder('Describe the event…');
    this.categorySelect = page.getByLabel('Category');
    this.cityInput = page.getByLabel('City');
    this.venueInput = page.getByLabel('Venue');
    this.dateInput = page.getByLabel('Event Date & Time');
    this.priceInput = page.getByLabel('Price ($)');
    this.totalSeatsInput = page.getByLabel('Total Seats');
    this.imageUrlInput = page.getByLabel('Image URL (optional)');
    this.addEventButton = page.getByTestId('add-event-btn');

    this.titleRequiredError = page.getByText('Title is required');
    this.venueRequiredError = page.getByText('Venue is required');
    this.dateRequiredError = page.getByText('Event date is required');
    this.priceRequiredError = page.getByText('Enter a valid price (≥ 0)');
    this.cityRequiredError = page.getByText('City is required');
    this.seatsRequiredError = page.getByText('Must have at least 1 seat');

    this.eventTableRows = page.getByTestId('event-table-row');
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/events');
  }

  getRowByTitle(title: string): Locator {
    return this.eventTableRows.filter({ hasText: title });
  }

  getEditButtonForEvent(title: string): Locator {
    return this.getRowByTitle(title).getByTestId('edit-event-btn');
  }

  getDeleteButtonForEvent(title: string): Locator {
    return this.getRowByTitle(title).getByTestId('delete-event-btn');
  }

  async fillNewEventForm(event: {
    title: string;
    description?: string;
    category?: string;
    city: string;
    venue: string;
    date: string;
    price: string;
    totalSeats: string;
    imageUrl?: string;
  }): Promise<void> {
    await this.titleInput.fill(event.title);
    if (event.description) await this.descriptionInput.fill(event.description);
    if (event.category) await this.categorySelect.selectOption(event.category);
    await this.cityInput.fill(event.city);
    await this.venueInput.fill(event.venue);
    await this.dateInput.fill(event.date);
    await this.priceInput.fill(event.price);
    await this.totalSeatsInput.fill(event.totalSeats);
    if (event.imageUrl) await this.imageUrlInput.fill(event.imageUrl);
  }

  async submitNewEvent(): Promise<void> {
    await this.addEventButton.click();
  }

  async deleteEvent(title: string): Promise<void> {
    await this.getDeleteButtonForEvent(title).click();
    await this.confirmDialog.confirm();
  }

  async editEvent(title: string): Promise<void> {
    await this.getEditButtonForEvent(title).click();
  }

  async getTableRowCount(): Promise<number> {
    return this.eventTableRows.count();
  }
}
