/**
 * Converts a params object into a string-only record for Playwright's request client.
 *
 * Playwright requires all query param values to be strings, but our interfaces
 * use proper types (number, boolean) to match the API spec. This handles the
 * conversion at the transport boundary so the rest of the code stays clean.
 *
 * Example:
 *   Input:  { page: 1, limit: 10, category: 'Conference', city: undefined }
 *   Output: { page: '1', limit: '10', category: 'Conference' }
 */
export function buildQueryParams(
  params?: object
): Record<string, string> | undefined {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  );
}