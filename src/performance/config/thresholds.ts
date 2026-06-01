// src/performance/config/thresholds.ts

/**
 * Industry standard thresholds for performance gates.
 * Tests fail if any threshold is breached.
 */
export const thresholds = {
  // 95% of requests must complete under 2 seconds
  // 99% of requests must complete under 5 seconds
  http_req_duration: ['p(95)<2000', 'p(99)<5000'],

  // less than 1% of requests can fail
  http_req_failed: ['rate<0.01'],
};