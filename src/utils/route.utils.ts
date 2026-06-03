// src/utils/route.utils.ts
import { type Page, type Route } from '@playwright/test';

/**
 * Intercepts an API endpoint and returns mock data.
 * Used in UI tests to isolate page behaviour from real backend data.
 *
 * Auth token is still real — EventHub validates JWTs server-side
 * so a fake token would be rejected. All data responses are mocked.
 */
export async function mockRoute(
  page: Page,
  url: string,
  response: object,
  status = 200,
): Promise<void> {
  await page.route(url, async (route: Route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}