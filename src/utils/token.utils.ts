// src/utils/token.utils.ts

/**
 * Decodes the payload of a JWT token without verifying the signature.
 * Verification is handled server-side — we only need the expiry claim here.
 */
function decodeTokenPayload(token: string): Record<string, unknown> {
  const payload = token.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
}

/**
 * Returns true if the token will expire within the given threshold.
 * Defaults to 5 minutes — gives the suite enough runway to complete
 * without mid-run expiry on long test runs.
 */
export function isTokenExpiringSoon(
  token: string,
  thresholdSeconds = 300,
): boolean {
  try {
    const payload = decodeTokenPayload(token);
    const exp = payload.exp as number;
    const secondsRemaining = exp - Math.floor(Date.now() / 1000);
    return secondsRemaining < thresholdSeconds;
  } catch {
    // if we can't decode the token treat it as expired
    return true;
  }
}

/**
 * Returns the number of seconds until the token expires.
 * Useful for logging and debugging token lifetime issues.
 */
export function getTokenSecondsRemaining(token: string): number {
  try {
    const payload = decodeTokenPayload(token);
    const exp = payload.exp as number;
    return exp - Math.floor(Date.now() / 1000);
  } catch {
    return 0;
  }
}
