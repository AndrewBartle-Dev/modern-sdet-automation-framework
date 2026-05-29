# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\homePage.spec.ts >> Home Page >> should display authenticated home page content
- Location: tests\ui\homePage.spec.ts:14:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Events' })
Expected: visible
Error: strict mode violation: getByRole('link', { name: 'Events' }) resolved to 5 elements:
    1) <a href="/events" id="nav-events" data-testid="nav-events" class="↵        px-4 py-2 rounded-lg text-sm font-medium transition-colors↵        text-gray-600 hover:text-gray-900 hover:bg-gray-100↵      ">Events</a> aka getByTestId('nav-events')
    2) <a href="/events">…</a> aka getByRole('link', { name: 'Browse Events →' })
    3) <a href="/events">…</a> aka getByRole('link', { name: 'Explore All Events' })
    4) <a href="/events" class="hover:text-white transition-colors">Browse Events</a> aka getByRole('link', { name: 'Browse Events', exact: true })
    5) <a href="/admin/events" class="hover:text-white transition-colors">Manage Events</a> aka getByRole('link', { name: 'Manage Events' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: 'Events' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "EventHub" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e9]: EventHub
      - generic [ref=e10]:
        - link "Home" [ref=e11] [cursor=pointer]:
          - /url: /
        - link "Events" [ref=e12] [cursor=pointer]:
          - /url: /events
        - link "My Bookings" [ref=e13] [cursor=pointer]:
          - /url: /bookings
        - link "API Docs" [ref=e14] [cursor=pointer]:
          - /url: https://api.eventhub.rahulshettyacademy.com/api/docs
        - button "Admin" [ref=e16] [cursor=pointer]:
          - text: Admin
          - img [ref=e17]
        - generic [ref=e19]:
          - generic "motomn65@aim.com" [ref=e20]
          - button "Logout" [ref=e21] [cursor=pointer]
  - main [ref=e22]:
    - generic [ref=e23]:
      - generic [ref=e26]:
        - heading "Discover & Book Amazing Events" [level=1] [ref=e27]:
          - text: Discover & Book
          - text: Amazing Events
        - paragraph [ref=e28]: From tech conferences to live concerts, sports events to cultural festivals — find experiences that inspire you.
        - generic [ref=e29]:
          - link "Browse Events →" [ref=e30] [cursor=pointer]:
            - /url: /events
            - generic [ref=e31]: Browse Events →
          - link "My Bookings" [ref=e32] [cursor=pointer]:
            - /url: /bookings
            - button "My Bookings" [ref=e33]
      - generic [ref=e35]:
        - generic [ref=e36]:
          - heading "Featured Events" [level=2] [ref=e37]
          - paragraph [ref=e38]: Hand-picked upcoming events just for you
        - link "View all →" [ref=e39] [cursor=pointer]:
          - /url: /events
      - generic [ref=e96]:
        - heading "Ready to experience something new?" [level=2] [ref=e97]
        - paragraph [ref=e98]: Browse thousands of events across India. Book tickets in seconds.
        - link "Explore All Events" [ref=e99] [cursor=pointer]:
          - /url: /events
          - button "Explore All Events" [ref=e100]
  - contentinfo [ref=e101]:
    - generic [ref=e102]:
      - generic [ref=e103]:
        - generic [ref=e104]:
          - heading "Rahul Shetty Academy" [level=3] [ref=e105]
          - paragraph [ref=e106]: India's leading QA automation training academy — empowering engineers to build real-world testing skills.
        - generic [ref=e107]:
          - heading "Popular Courses" [level=3] [ref=e108]
          - list [ref=e109]:
            - listitem [ref=e110]:
              - link "Selenium WebDriver with Java" [ref=e111] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
            - listitem [ref=e112]:
              - link "Playwright with JavaScript" [ref=e113] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
            - listitem [ref=e114]:
              - link "RestAssured API Testing" [ref=e115] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
            - listitem [ref=e116]:
              - link "Cypress End-to-End Testing" [ref=e117] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
            - listitem [ref=e118]:
              - link "Appium Mobile Testing" [ref=e119] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
        - generic [ref=e120]:
          - heading "QA Job Hiring Platform" [level=3] [ref=e121]
          - paragraph [ref=e122]: Get hired faster — take skill assessments trusted by top QA employers worldwide.
          - link "techsmarthire.com →" [ref=e123] [cursor=pointer]:
            - /url: https://techsmarthire.com
        - generic [ref=e124]:
          - heading "EventHub Practice App" [level=3] [ref=e125]
          - list [ref=e126]:
            - listitem [ref=e127]:
              - link "Browse Events" [ref=e128] [cursor=pointer]:
                - /url: /events
            - listitem [ref=e129]:
              - link "My Bookings" [ref=e130] [cursor=pointer]:
                - /url: /bookings
            - listitem [ref=e131]:
              - link "Manage Events" [ref=e132] [cursor=pointer]:
                - /url: /admin/events
            - listitem [ref=e133]:
              - link "API Documentation" [ref=e134] [cursor=pointer]:
                - /url: https://api.eventhub.rahulshettyacademy.com/api/docs
      - generic [ref=e135]:
        - paragraph [ref=e136]: © 2026 Rahul Shetty Academy. All rights reserved.
        - generic [ref=e137]:
          - link "rahulshettyacademy.com →" [ref=e138] [cursor=pointer]:
            - /url: https://rahulshettyacademy.com
          - link "techsmarthire.com →" [ref=e139] [cursor=pointer]:
            - /url: https://techsmarthire.com
  - alert [ref=e140]
```

# Test source

```ts
  1  | import { expect, type Locator, type Page } from '@playwright/test';
  2  | 
  3  | export class NavigationComponent {
  4  |   readonly page: Page;
  5  | 
  6  |   readonly navigation: Locator;
  7  |   readonly logoLink: Locator;
  8  |   readonly homeLink: Locator;
  9  |   readonly eventsLink: Locator;
  10 |   readonly bookingsLink: Locator;
  11 |   readonly apiDocsLink: Locator;
  12 |   readonly adminButton: Locator;
  13 |   readonly logoutButton: Locator;
  14 |   readonly manageEventsMenuItem: Locator;
  15 |   readonly manageBookingsMenuItem: Locator;
  16 | 
  17 |   constructor(page: Page) {
  18 |     this.page = page;
  19 | 
  20 |     this.navigation = page.getByRole('navigation');
  21 |     this.logoLink = page.getByRole('link', { name: 'EventHub' });
  22 |     this.homeLink = page.getByRole('link', { name: 'Home' });
  23 |     this.eventsLink = page.getByRole('link', { name: 'Events' });
  24 |     this.bookingsLink = page.getByRole('link', { name: 'My Bookings' });
  25 |     this.apiDocsLink = page.getByRole('link', { name: 'API Docs' });
  26 |     this.adminButton = page.getByRole('button', { name: /Admin/ });
  27 |     this.logoutButton = page.getByRole('button', { name: 'Logout' });
  28 | 
  29 |     this.manageEventsMenuItem = page.getByRole('link', { name: 'Manage Events', exact: true });
  30 |     this.manageBookingsMenuItem = page.getByRole('link', { name: 'Manage Bookings', exact: true });
  31 |   }
  32 | 
  33 |   userEmail(email: string): Locator {
  34 |     return this.page.getByText(email, { exact: true });
  35 |   }
  36 | 
  37 |   async openAdminMenu(): Promise<void> {
  38 |     await this.adminButton.click();
  39 |   }
  40 | 
  41 |   async verifyAdminMenuItemsVisible(): Promise<void> {
  42 |     await this.openAdminMenu();
  43 |     await expect(this.manageEventsMenuItem).toBeVisible();
  44 |     await expect(this.manageBookingsMenuItem).toBeVisible();
  45 |   }
  46 | 
  47 |   async goToManageEvents(): Promise<void> {
  48 |     await this.openAdminMenu();
  49 |     await this.manageEventsMenuItem.click();
  50 |   }
  51 | 
  52 |   async goToManageBookings(): Promise<void> {
  53 |     await this.openAdminMenu();
  54 |     await this.manageBookingsMenuItem.click();
  55 |   }
  56 | 
  57 |   async verifyAuthenticatedNavigation(email: string): Promise<void> {
  58 |     await expect(this.navigation).toBeVisible();
  59 |     await expect(this.logoLink).toBeVisible();
  60 |     await expect(this.homeLink).toBeVisible();
> 61 |     await expect(this.eventsLink).toBeVisible();
     |                                   ^ Error: expect(locator).toBeVisible() failed
  62 |     await expect(this.bookingsLink).toBeVisible();
  63 |     await expect(this.apiDocsLink).toBeVisible();
  64 |     await expect(this.adminButton).toBeVisible();
  65 |     await expect(this.userEmail(email)).toBeVisible();
  66 |     await expect(this.logoutButton).toBeVisible();
  67 |   }
  68 | 
  69 |   async logout(): Promise<void> {
  70 |     await this.logoutButton.click();
  71 |   }
  72 | }
```