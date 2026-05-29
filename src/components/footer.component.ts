import { expect, type Locator, type Page } from '@playwright/test';

export class FooterComponent {
  readonly footer: Locator;
  readonly academyHeading: Locator;
  readonly popularCoursesHeading: Locator;
  readonly hiringPlatformHeading: Locator;
  readonly practiceAppHeading: Locator;

  constructor(page: Page) {
    this.footer = page.getByRole('contentinfo');
    this.academyHeading = page.getByRole('heading', {
      name: 'Rahul Shetty Academy',
      level: 3,
    });
    this.popularCoursesHeading = page.getByRole('heading', {
      name: 'Popular Courses',
      level: 3,
    });
    this.hiringPlatformHeading = page.getByRole('heading', {
      name: 'QA Job Hiring Platform',
      level: 3,
    });
    this.practiceAppHeading = page.getByRole('heading', {
      name: 'EventHub Practice App',
      level: 3,
    });
  }

  async verifyFooterVisible(): Promise<void> {
    await expect(this.footer).toBeVisible();
    await expect(this.academyHeading).toBeVisible();
    await expect(this.popularCoursesHeading).toBeVisible();
    await expect(this.hiringPlatformHeading).toBeVisible();
    await expect(this.practiceAppHeading).toBeVisible();
  }
}