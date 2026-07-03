import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  readonly heroHeading: Locator;
  readonly heroDescription: Locator;
  readonly apiDocsLink: Locator;
  readonly appPreviewImage: Locator;
  readonly signInHeading: Locator;
  readonly signInSubtitle: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });

    this.heroHeading = page.getByRole('heading', {
      name: /The #1 QA Practice Hub for Automation Engineers/,
      level: 2,
    });

    this.heroDescription = page.getByText(
      'EventHub is a production-grade practice app designed so you can sharpen your testing skills on real-world scenarios — before your next interview or project.',
      { exact: true }
    );

    this.apiDocsLink = page.getByRole('link', {
      name: 'API Documentation (Swagger)',
    });

    this.appPreviewImage = page.getByAltText('EventHub app preview');

    this.signInHeading = page.getByRole('heading', {
      name: 'Sign in to EventHub',
    });

    this.signInSubtitle = page.getByText('Enter your credentials to continue', {
      exact: true,
    });

    this.registerLink = page.getByRole('link', { name: 'Register' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
