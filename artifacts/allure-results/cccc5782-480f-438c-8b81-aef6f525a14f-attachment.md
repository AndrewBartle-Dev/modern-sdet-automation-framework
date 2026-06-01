# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\homePage.spec.ts >> Home Page >> should display admin menu options
- Location: tests\ui\homePage.spec.ts:20:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Manage Events', exact: true })
Expected: visible
Error: strict mode violation: getByRole('link', { name: 'Manage Events', exact: true }) resolved to 2 elements:
    1) <a href="/admin/events" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">…</a> aka getByRole('navigation').getByRole('link', { name: 'Manage Events' })
    2) <a href="/admin/events" class="hover:text-white transition-colors">Manage Events</a> aka getByRole('contentinfo').getByRole('link', { name: 'Manage Events' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: 'Manage Events', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
        - generic [ref=e15]:
          - button "Admin" [active] [ref=e16] [cursor=pointer]:
            - text: Admin
            - img [ref=e17]
          - generic [ref=e19]:
            - link "Manage Events" [ref=e20] [cursor=pointer]:
              - /url: /admin/events
              - img [ref=e21]
              - text: Manage Events
            - link "Manage Bookings" [ref=e23] [cursor=pointer]:
              - /url: /admin/bookings
              - img [ref=e24]
              - text: Manage Bookings
        - generic [ref=e26]:
          - generic "motomn65@aim.com" [ref=e27]
          - button "Logout" [ref=e28] [cursor=pointer]
  - main [ref=e29]:
    - generic [ref=e30]:
      - generic [ref=e33]:
        - heading "Discover & Book Amazing Events" [level=1] [ref=e34]:
          - text: Discover & Book
          - text: Amazing Events
        - paragraph [ref=e35]: From tech conferences to live concerts, sports events to cultural festivals — find experiences that inspire you.
        - generic [ref=e36]:
          - link "Browse Events →" [ref=e37] [cursor=pointer]:
            - /url: /events
            - generic [ref=e38]: Browse Events →
          - link "My Bookings" [ref=e39] [cursor=pointer]:
            - /url: /bookings
            - button "My Bookings" [ref=e40]
      - generic [ref=e42]:
        - generic [ref=e43]:
          - heading "Featured Events" [level=2] [ref=e44]
          - paragraph [ref=e45]: Hand-picked upcoming events just for you
        - link "View all →" [ref=e46] [cursor=pointer]:
          - /url: /events
      - generic [ref=e103]:
        - heading "Ready to experience something new?" [level=2] [ref=e104]
        - paragraph [ref=e105]: Browse thousands of events across India. Book tickets in seconds.
        - link "Explore All Events" [ref=e106] [cursor=pointer]:
          - /url: /events
          - button "Explore All Events" [ref=e107]
  - contentinfo [ref=e108]:
    - generic [ref=e109]:
      - generic [ref=e110]:
        - generic [ref=e111]:
          - heading "Rahul Shetty Academy" [level=3] [ref=e112]
          - paragraph [ref=e113]: India's leading QA automation training academy — empowering engineers to build real-world testing skills.
        - generic [ref=e114]:
          - heading "Popular Courses" [level=3] [ref=e115]
          - list [ref=e116]:
            - listitem [ref=e117]:
              - link "Selenium WebDriver with Java" [ref=e118] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
            - listitem [ref=e119]:
              - link "Playwright with JavaScript" [ref=e120] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
            - listitem [ref=e121]:
              - link "RestAssured API Testing" [ref=e122] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
            - listitem [ref=e123]:
              - link "Cypress End-to-End Testing" [ref=e124] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
            - listitem [ref=e125]:
              - link "Appium Mobile Testing" [ref=e126] [cursor=pointer]:
                - /url: https://rahulshettyacademy.com
        - generic [ref=e127]:
          - heading "QA Job Hiring Platform" [level=3] [ref=e128]
          - paragraph [ref=e129]: Get hired faster — take skill assessments trusted by top QA employers worldwide.
          - link "techsmarthire.com →" [ref=e130] [cursor=pointer]:
            - /url: https://techsmarthire.com
        - generic [ref=e131]:
          - heading "EventHub Practice App" [level=3] [ref=e132]
          - list [ref=e133]:
            - listitem [ref=e134]:
              - link "Browse Events" [ref=e135] [cursor=pointer]:
                - /url: /events
            - listitem [ref=e136]:
              - link "My Bookings" [ref=e137] [cursor=pointer]:
                - /url: /bookings
            - listitem [ref=e138]:
              - link "Manage Events" [ref=e139] [cursor=pointer]:
                - /url: /admin/events
            - listitem [ref=e140]:
              - link "API Documentation" [ref=e141] [cursor=pointer]:
                - /url: https://api.eventhub.rahulshettyacademy.com/api/docs
      - generic [ref=e142]:
        - paragraph [ref=e143]: © 2026 Rahul Shetty Academy. All rights reserved.
        - generic [ref=e144]:
          - link "rahulshettyacademy.com →" [ref=e145] [cursor=pointer]:
            - /url: https://rahulshettyacademy.com
          - link "techsmarthire.com →" [ref=e146] [cursor=pointer]:
            - /url: https://techsmarthire.com
  - alert [ref=e147]
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
> 43 |     await expect(this.manageEventsMenuItem).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
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
  61 |     await expect(this.eventsLink).toBeVisible();
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