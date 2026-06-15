// src/fixtures/auth.fixture.ts
import { test as base, type Page } from '@playwright/test';
import fs from 'fs';
import { EventHubUserClient } from '../api/clients/eventHubUserClient';
import { isTokenExpiringSoon, getTokenSecondsRemaining } from '../utils/token.utils';

const AUTH_STATE_PATH = 'auth-state.json';

type AuthState = {
  token: string;
  id: number;
  email: string;
};

type AuthFixtures = {
  authenticatedPage: Page;
  userClient: EventHubUserClient;
};

/**
 * Reads the cached auth state from the appropriate source.
 *
 * On CI: reads from environment variables set by global-setup.
 * Locally: reads from auth-state.json written by global-setup.
 *
 * Returns null if no cached state is available — the fixture
 * will fall back to a fresh API login in that case.
 */
function readCachedAuthState(): AuthState | null {
  if (process.env.CI) {
    const token = process.env.AUTH_TOKEN;
    const id = process.env.AUTH_USER_ID;
    const email = process.env.AUTH_USER_EMAIL;

    if (token && id && email) {
      return { token, id: Number(id), email };
    }
    return null;
  }

  try {
    const raw = fs.readFileSync(AUTH_STATE_PATH, 'utf-8');
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

export const test = base.extend<AuthFixtures>({
  userClient: async ({ request }, use) => {
    const userClient = new EventHubUserClient(request);
    const cached = readCachedAuthState();

    if (cached && !isTokenExpiringSoon(cached.token)) {
      // Happy path — use the cached token, no API call needed
      const secondsRemaining = getTokenSecondsRemaining(cached.token);
      console.log(
        `[auth.fixture] Using cached token (expires in ${Math.floor(secondsRemaining / 60)}m)`,
      );
      userClient.authenticateWithToken(cached.token, cached.id, cached.email);
    } else {
      // Fallback — token missing, expired, or expiring soon — re-authenticate
      if (cached) {
        console.log('[auth.fixture] Cached token expiring soon — re-authenticating');
      } else {
        console.log('[auth.fixture] No cached token found — authenticating');
      }
      await userClient.authenticate();
    }

    await use(userClient);
  },

  authenticatedPage: async ({ page, userClient }, use) => {
    const token = userClient.getAuthToken();

    await page.addInitScript((tokenValue) => {
      window.localStorage.setItem('eventhub_token', tokenValue);
    }, token);

    // Navigate to the app and wait for a stable authenticated state
    // before handing the page to the test
    await page.goto('/');
    await page.waitForURL('/');

    await use(page);
  },
});