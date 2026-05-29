import { expect, type Locator, type Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component';
import { FooterComponent } from '../components/footer.component';
import { EventCardComponent } from '../components/event-card.component';

export class HomePage {
  readonly page: Page;

  readonly navigation: NavigationComponent;
  readonly footer: FooterComponent;
  readonly eventCards: EventCardComponent;

  readonly heroHeading: Locator;
  readonly heroDescription: Locator;
  readonly browseEventsLink: Locator;
  readonly myBookingsHeroLink: Locator;

  readonly featuredHeading: Locator;
  readonly featuredSubtitle: Locator;
  readonly viewAllEventsLink: Locator;

  readonly ctaHeading: Locator;
  readonly ctaDescription: Locator;
  readonly exploreAllEventsButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navigation = new NavigationComponent(page);
    this.footer = new FooterComponent(page);
    this.eventCards = new EventCardComponent(page);

    this.heroHeading = page.getByRole('heading', {
      name: 'Discover & Book Amazing Events',
      level: 1,
    });

    this.heroDescription = page.getByText(
      'From tech conferences to live concerts, sports events to cultural festivals — find experiences that inspire you.',
      { exact: true }
    );

    this.browseEventsLink = page.getByRole('link', { name: 'Browse Events →' });
    this.myBookingsHeroLink = page.getByRole('link', { name: 'My Bookings' }).nth(1);

    this.featuredHeading = page.getByRole('heading', {
      name: 'Featured Events',
      level: 2,
    });

    this.featuredSubtitle = page.getByText(
      'Hand-picked upcoming events just for you',
      { exact: true }
    );

    this.viewAllEventsLink = page.getByRole('link', { name: 'View all →' });

    this.ctaHeading = page.getByRole('heading', {
      name: 'Ready to experience something new?',
      level: 2,
    });

    this.ctaDescription = page.getByText(
      'Browse thousands of events across India. Book tickets in seconds.',
      { exact: true }
    );

    this.exploreAllEventsButton = page.getByRole('button', {
      name: 'Explore All Events',
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async verifyHomePageContent(): Promise<void> {
    await expect(this.heroHeading).toBeVisible();
    await expect(this.heroDescription).toBeVisible();
    await expect(this.browseEventsLink).toBeVisible();
    await expect(this.myBookingsHeroLink).toBeVisible();

    await expect(this.featuredHeading).toBeVisible();
    await expect(this.featuredSubtitle).toBeVisible();
    await expect(this.viewAllEventsLink).toBeVisible();

    await expect(this.ctaHeading).toBeVisible();
    await expect(this.ctaDescription).toBeVisible();
    await expect(this.exploreAllEventsButton).toBeVisible();
  }

  async verifyAuthenticatedHome(email: string): Promise<void> {
    await this.navigation.verifyAuthenticatedNavigation(email);
    await this.verifyHomePageContent();
    await this.footer.verifyFooterVisible();
  }

  async browseEvents(): Promise<void> {
    await this.browseEventsLink.click();
  }

  async viewAllEvents(): Promise<void> {
    await this.viewAllEventsLink.click();
  }

  async openMyBookings(): Promise<void> {
    await this.myBookingsHeroLink.click();
  }

  async exploreAllEvents(): Promise<void> {
    await this.exploreAllEventsButton.click();
  }
}