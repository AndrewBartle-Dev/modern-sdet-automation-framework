# EventHub Automation Framework — Agent Standards

---

## Critical Import Rule

ALWAYS import `test` and `expect` from the auth fixture, NEVER from `@playwright/test` directly:

```typescript
// ✅ correct
import { test, expect } from "../../src/fixtures/auth.fixture";

// ❌ never do this
import { test, expect } from "@playwright/test";
```

## Environment Variables

ALWAYS use the ENV config, never access process.env directly:

```typescript
// ✅ correct
import { ENV } from "../../src/config/env";
await page.goto(ENV.BASE_URL);

// ❌ never do this
await page.goto(process.env.BASE_URL);
```

---

# Locator Priority — strictly in this order

1. `getByTestId` — always use first when a data-testid attribute exists
2. `getByRole` — for interactive elements without testId
3. `getByLabel` — for form inputs without testId
4. `getByPlaceholder` — for inputs identified by placeholder text
5. `getByText` — for text content only when no other option exists
6. CSS selectors — last resort only, avoid where possible

---

# Page Object Standards

## Structure

- One class per page, saved in `src/pages/`
- One class per component, saved in `src/components/`
- File naming: `home.page.ts`, `login.page.ts`, `navigation.component.ts`

## Method Types

- **Action methods** — perform UI interactions, no assertions: `clickBookNow()`, `fillLoginForm()`
- **Verify methods** — contain assertions, named with `verify` prefix: `verifyHomePageContent()`, `verifyAuthenticatedHome()`
- Assertions belong in verify methods only — never in action methods

## Component Scoping

Navigation locators MUST be scoped through `this.navigation` to avoid strict mode
collisions with footer links that share the same text:

```typescript
// ✅ correct — scoped to nav element
this.navigation.getByTestId("nav-home");

// ❌ wrong — will collide with footer
page.getByTestId("nav-home");
```

## Page Object Template

```typescript
import { type Page, type Locator } from "@playwright/test";
import { expect } from "../fixtures/auth.fixture";
import { ENV } from "../config/env";

export class ExamplePage {
  private readonly page: Page;

  // define locators as readonly properties
  private readonly someButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.someButton = page.getByTestId("some-button");
  }

  async goto(): Promise<void> {
    await this.page.goto(`${ENV.BASE_URL}/path`);
  }

  // action method — no assertions
  async clickSomeButton(): Promise<void> {
    await this.someButton.click();
  }

  // verify method — assertions allowed
  async verifySomething(): Promise<void> {
    await expect(this.someButton).toBeVisible();
    await expect(this.page).toHaveURL(`${ENV.BASE_URL}/path`);
  }
}


```
## When to Assert in Page Objects vs Test Files

**Assert in the page object** — when the expected outcome will always be 
the same regardless of test data or workflow. Use a verify method:

```typescript
async verifyNavigationVisible(): Promise {
  await expect(this.navigation).toBeVisible();
}
```

**Return a boolean to the test** — when the expected outcome could differ 
depending on the workflow or test data. Let the test decide what to assert:

```typescript
// page object
async isWelcomeMessageVisible(): Promise<boolean> {
  return this.welcomeMessage.isVisible();
}

// test file decides the expected outcome
expect(await homePage.isWelcomeMessageVisible()).toBe(true);

---

# Test Type Behaviour

## UI Tests (`tests/ui/`)

- Import `authenticatedPage` fixture — auth token injected into localStorage, no UI login
- Set up test data via API using `userClient` — never navigate through UI to create data
- Focused on a single page or component in isolation
- Tag with `@ui` and `@regression`, smoke tests also get `@smoke`

```typescript
test(
  "example UI test",
  { tag: ["@ui", "@regression"] },
  async ({ authenticatedPage }) => {
    const homePage = new HomePage(authenticatedPage);
    await homePage.goto();
    await homePage.verifyHomePageContent();
  },
);
```

## E2E Tests (`tests/e2e/`)

- Simulates real user journeys across multiple pages
- Auth token injected via fixture for setup — UI interactions drive the journey
- Can span multiple pages and workflows
- Tag with `@e2e` and `@regression`

```typescript
test(
  "user can book an event",
  { tag: ["@e2e", "@regression"] },
  async ({ page }) => {
    // full browser flow — login through UI
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ENV.TEST_EMAIL, ENV.TEST_PASSWORD);
    // continue across pages...
  },
);
```

## API Tests (`tests/api/`)

- Use `userClient` fixture — no browser needed
- Import `validateSchema` for response validation
- Tag with `@api` and `@regression`, smoke tests also get `@smoke`

---

# Flakiness Prevention

- Avoid `page.waitForTimeout()` — use explicit waits where timing issues exist
- Use `await expect(locator).toBeVisible()` before interacting with dynamic elements
- Use `await page.waitForURL()` after navigation when the URL change matters
- Prefer `expect(locator).toHaveText()` over `locator.textContent()` for assertions
- Avoid hard-coded timeouts — investigate the root cause instead

---

# Test Structure Rules

- One test, one scenario — never test multiple unrelated workflows in a single test
- Tests must be fully independent — no test depends on state from another test
- Use `test.describe` blocks matching the page or feature name
- Always tag tests: `@smoke`, `@ui`, `@api`, `@e2e`, `@regression`
- Never hardcode credentials — always use `ENV.TEST_EMAIL` and `ENV.TEST_PASSWORD`
- Clean up test data after each test using `test.afterEach` or fixture teardown
