// global-setup.ts
import { request as playwrightRequest } from '@playwright/test';
import fs from 'fs';
import { ENV } from './src/config/env';
import { AuthService } from './src/api/services/auth.service';

const AUTH_STATE_PATH = 'auth-state.json';

/**
 * Runs once before the entire test suite.
 * Authenticates via the API and caches the token so fixtures
 * don't need to hit the login endpoint on every test.
 *
 * Uses Playwright's standalone API request context — no browser needed.
 * This means global-setup works in any CI job without requiring
 * Playwright browsers to be installed.
 *
 * On CI: stores token in environment variables — no file written to disk.
 * Locally: writes auth-state.json to the project root (git-ignored).
 */
export default async function globalSetup(): Promise<void> {
  const context = await playwrightRequest.newContext();

  const authService = new AuthService(context);

  console.log('[global-setup] Authenticating test user...');

  const { token, id, email } = await authService.login(
    ENV.TEST_EMAIL,
    ENV.TEST_PASSWORD,
  );

  console.log(`[global-setup] Authenticated as ${email}`);

  if (process.env.CI) {
    // On CI — store in process.env, no file written to disk
    process.env.AUTH_TOKEN = token;
    process.env.AUTH_USER_ID = String(id);
    process.env.AUTH_USER_EMAIL = email;
    console.log('[global-setup] Token stored in environment (CI mode)');
  } else {
    // Locally — write to disk (auth-state.json is git-ignored)
    fs.writeFileSync(
      AUTH_STATE_PATH,
      JSON.stringify({ token, id, email }, null, 2),
    );
    console.log(`[global-setup] Token cached to ${AUTH_STATE_PATH}`);
  }

  await context.dispose();
}