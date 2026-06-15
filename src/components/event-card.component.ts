import { expect, type Locator, type Page } from "@playwright/test";

export class EventCardComponent {
  readonly page: Page;
  readonly eventCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventCards = page.getByTestId("event-card");
  }

  getEventCardByTitle(title: string): Locator {
    return this.eventCards.filter({
      has: this.page.getByRole("link", { name: title }),
    });
  }

  getBookNowButtonByTitle(title: string): Locator {
    return this.getEventCardByTitle(title).getByTestId("book-now-btn");
  }

  async verifyEventCardVisible(title: string): Promise<void> {
    await expect(this.getEventCardByTitle(title)).toBeVisible();
  }

  async bookEventByTitle(title: string): Promise<void> {
    await this.getBookNowButtonByTitle(title).click();
  }

  async expectCardCountToBe(count: number): Promise<void> {
  await expect(this.eventCards).toHaveCount(count);
}

async verifyFirstEventCardVisible(): Promise<void> {
  await expect(this.eventCards.first()).toBeVisible();
}

}
