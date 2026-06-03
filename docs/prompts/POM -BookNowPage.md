# Task: Book Now Page — Generate Page Object and Test

**App URL:** https://eventhub.rahulshettyacademy.com
**Standards:** `docs/prompts/agent-standards.md`

## Context

The EventHub application has an authenticated fixture that injects a JWT token
into localStorage before the browser loads, so tests start already logged in.
The fixture is located at `src/fixtures/auth.fixture.ts`.

Existing page objects:
- `src/pages/home.page.ts` — home page after login
- `src/pages/login.page.ts` — login page

## Navigation Flow

1. Start on the home page using `authenticatedPage` fixture
2. Click Book Now on an event card
3. This lands on the booking form page

## Generate the Following

### Page Object
- `src/pages/booking.page.ts` — booking form page

### Test File
- `tests/ui/booking.spec.ts` — UI test using `authenticatedPage` fixture

## Requirements
- Use `authenticatedPage` fixture — do not navigate through the login UI
- Follow locator priority from `docs/prompts/agent-standards.md`
- Return booleans from page object methods where the outcome could vary
  by workflow — assert in verify methods only where the outcome is always known
- Tag tests with `@ui` and `@regression`
- Use `ENV.BASE_URL` for all URLs
- Use `ENV.TEST_EMAIL` for customer email in the booking form