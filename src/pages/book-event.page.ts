import { type Locator, type Page } from "@playwright/test";
import { ENV } from "../config/env";
import { NavigationComponent } from "../components/navigation.component";

/**
 * Booking Page — event detail and ticket booking form.
 * Covers the booking form, quantity controls, and confirmation state
 * that renders inline after a successful submission.
 *
 * Note: Many element locators rely on visible text or CSS classes due to the booking page's
 * lack of data-testid attributes, which makes them fragile and prone to breakage with UI changes.
 * For example, the ticket count display uses an id selector, and the booking confirmation values rely on a combination of CSS classes and text content.
 * These locators would need refinement for robustness in a production test suite,
 * ideally with collaboration from the development team to add test-friendly attributes where necessary.
 */
export class BookingPage {
  private readonly page: Page;
  readonly navigation: NavigationComponent;

  // event detail
  readonly aboutHeading: Locator;

  // booking form
  readonly ticketsHeading: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly decrementQuantityButton: Locator;
  readonly incrementQuantityButton: Locator;
  readonly confirmBookingButton: Locator;
  readonly ticketCount: Locator;

  // confirmation state — renders inline after successful booking
  readonly bookingConfirmedHeading: Locator;
  readonly ticketsReservedText: Locator;
  readonly bookingRefValue: Locator;
  readonly viewMyBookingsButton: Locator;
  readonly browseMoreEventsButton: Locator;
  readonly seatValidationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = new NavigationComponent(page);

    // event detail
    this.aboutHeading = page.getByRole("heading", {
      name: "About this event",
      level: 2,
    });

    // booking form
    this.ticketsHeading = page.getByRole("heading", {
      name: "Book Tickets",
      level: 2,
    });

    this.fullNameInput = page.getByLabel("Full Name");
    this.emailInput = page.getByTestId("customer-email");
    this.phoneInput = page.getByLabel("Phone Number");

    // note: decrement uses unicode minus sign − not hyphen -
    this.decrementQuantityButton = page.getByRole("button", { name: "−" });
    this.incrementQuantityButton = page.getByRole("button", { name: "+" });
    this.confirmBookingButton = page.getByRole("button", {
      name: "Confirm Booking",
    });

    // ticket count display — no data-testid, using id
    this.ticketCount = page.locator("#ticket-count");

    // confirmation state
    this.bookingConfirmedHeading = page.getByRole("heading", {
      name: "Booking Confirmed! 🎉",
    });
    this.ticketsReservedText = page.getByText("Your tickets are reserved.");

    // booking-ref class used — no data-testid available
    this.bookingRefValue = page.locator(".booking-ref");
    this.viewMyBookingsButton = page.getByRole("button", {
      name: "View My Bookings",
    });
    this.browseMoreEventsButton = page.getByRole("button", {
      name: "Browse More Events",
    });
    this.seatValidationError = page.getByText("Validation failed");
  }

  /**
   * Gets a value from the booking confirmation summary panel by its label.
   * Scoped to div.text-center.py-6 which only exists in the confirmation state,
   * preventing matches against the pre-submission price summary which shares
   * similar CSS classes.
   *
   * Note: This locator relies on CSS classes rather than data-testid attributes
   * which makes it fragile — any styling change could break it. In a production
   * project this would be raised as a testability gap and data-testid attributes
   * would be added to the confirmation panel elements in collaboration with the
   * development team.
   */
  getConfirmationValue(label: string): Locator {
    return this.page
      .locator("div.text-center.py-6")
      .locator("div.bg-indigo-50")
      .locator("div")
      .filter({ hasText: label })
      .locator("span.font-medium.text-gray-900");
  }

  eventTitle(title: string): Locator {
    return this.page.getByRole("heading", { name: title, level: 1 });
  }

  async goto(eventId: number): Promise<void> {
    await this.page.goto(`${ENV.BASE_URL}/events/${eventId}`);
  }

  async fillBookingForm(
    fullName: string,
    email: string,
    phone: string,
  ): Promise<void> {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
  }

  async getTicketCount(): Promise<number> {
    const text = await this.ticketCount.textContent();
    return parseInt(text!, 10);
  }

  async increaseQuantity(times = 1): Promise<void> {
    for (let index = 0; index < times; index += 1) {
      await this.incrementQuantityButton.click();
    }
  }

  async decreaseQuantity(times = 1): Promise<void> {
    for (let index = 0; index < times; index += 1) {
      await this.decrementQuantityButton.click();
    }
  }

  async submitBooking(): Promise<void> {
    await this.confirmBookingButton.click();
  }

  /**
   * Returns the booking ref from the confirmation panel.
   * Used after submitBooking() to retrieve the ref for subsequent
   * assertions or navigation without exposing locators to the test.
   */
  async getBookingRef(): Promise<string> {
    const ref = await this.bookingRefValue.textContent();
    return ref!.trim();
  }

  async goToMyBookings(): Promise<void> {
    await this.viewMyBookingsButton.click();
  }
}
