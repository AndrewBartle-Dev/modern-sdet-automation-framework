import { test as base, type Page } from "@playwright/test";
import { EventHubUserClient } from "../api/clients/eventHubUserClient";

type AuthFixtures = {
  authenticatedPage: Page;
  userClient: EventHubUserClient;
};

export const test = base.extend<AuthFixtures>({
  userClient: async ({ request }, use) => {
    const userClient = new EventHubUserClient(request);

    await userClient.authenticate();

    await use(userClient);
  },

  authenticatedPage: async ({ page, userClient }, use) => {
    const token = userClient.getAuthToken();

    await page.addInitScript((tokenValue) => {
      window.localStorage.setItem("eventhub_token", tokenValue);
    }, token);

    await use(page);
  },
});

export { expect } from "@playwright/test";
