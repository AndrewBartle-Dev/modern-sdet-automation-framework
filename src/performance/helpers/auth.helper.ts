// src/performance/helpers/auth.helper.ts
import http from 'k6/http';
import { check } from 'k6';

// k6 cannot use Node.js modules — environment variables are accessed
// via __ENV, a k6 built-in global passed in through --env flags or CI
const API_BASE_URL = __ENV.API_BASE_URL;

/**
 * Authenticates with the API and returns a JWT bearer token.
 *
 * Note: The Playwright auth fixture and AuthService cannot be used here
 * because k6 runs in its own isolated runtime — it has no access to
 * Node.js, Playwright, or any src/api services. Authentication must be
 * reimplemented using k6's built-in HTTP module instead.
 *
 * Called in setup() so authentication happens once before the load starts,
 * rather than repeating the login call on every iteration.
 */
export function getAuthToken(): string {
  const response = http.post(
    `${API_BASE_URL}/auth/login`,
    JSON.stringify({
      email: __ENV.TEST_EMAIL,
      password: __ENV.TEST_PASSWORD,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(response, {
    'login successful': (r) => r.status === 200,
    'token returned': (r) => JSON.parse(r.body as string).token !== undefined,
  });

  const body = JSON.parse(response.body as string);
  return body.token;
}

/**
 * Returns headers with the Bearer token attached.
 * Pass to every HTTP request that requires authentication.
 */
export function authHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}