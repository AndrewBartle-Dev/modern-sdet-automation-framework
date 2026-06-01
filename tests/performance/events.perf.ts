// tests/performance/events.perf.ts
import http from 'k6/http';
import { check, sleep } from 'k6';
import { getAuthToken, authHeaders } from '../../src/performance/helpers/auth.helper';
import { loadOptions } from '../../src/performance/config/options';
import { eventPayload } from '../../src/performance/data/test-data';

const API_BASE_URL = __ENV.API_BASE_URL;

/**
 * options tells k6 how to run the test — how many virtual users,
 * how long to run, and what the pass/fail thresholds are.
 * Imported from config so all performance tests share the same settings.
 */
export const options = loadOptions;

/**
 * setup() is a k6 lifecycle function that runs exactly once before
 * any virtual users start. Authentication and test data creation
 * happen here so all virtual users share the same token and event
 * rather than creating new data on every iteration.
 *
 * Whatever is returned from setup() is passed into both the default
 * function and teardown() as the first argument.
 */
export function setup() {
  const token = getAuthToken();
  const headers = authHeaders(token);

  // create one event before the load starts so all VUs
  // use the same event rather than creating one per iteration
  const createResponse = http.post(
    `${API_BASE_URL}/events`,
    JSON.stringify(eventPayload),
    { headers }
  );

  check(createResponse, {
    'setup: event created successfully': (r) => r.status === 201,
  });

  const body = JSON.parse(createResponse.body as string);

  return {
    token,
    eventId: body.data.id,
  };
}

/**
 * The default function is the test body — k6 executes this repeatedly
 * for each virtual user for the duration defined in options.
 *
 * Each execution simulates one user performing a sequence of actions:
 * listing events and viewing the specific event created in setup().
 *
 * @param data - the token and eventId returned from setup(), shared across all VUs
 */
export default function (data: { token: string; eventId: number }) {
  const headers = authHeaders(data.token);

  // GET /events — list all events
  // Validates the endpoint responds successfully and returns event data
  const listResponse = http.get(`${API_BASE_URL}/events`, { headers });

  check(listResponse, {
    // check() validates the response — results are tracked in the k6 output
    // as pass/fail counts but do not stop the test on their own.
    // Thresholds defined in options.ts are what actually fail the test.
    'GET /events returns 200': (r) => r.status === 200,
    'GET /events returns data': (r) => JSON.parse(r.body as string).data.length > 0,
  });

  // sleep() pauses the virtual user for 1 second between requests.
  // This simulates realistic user think time — a real user would not
  // instantly fire the next request the millisecond a response arrives.
  // Without sleep, VUs hammer the API back to back which is unrealistic
  // and skews response time results.
  sleep(1);

  // GET /events/:id — get the specific event created in setup()
  // Uses the id returned from setup() so no hardcoded test data is needed
  const getResponse = http.get(`${API_BASE_URL}/events/${data.eventId}`, { headers });

  check(getResponse, {
    // validates the correct event was returned by comparing the id
    // in the response against the id we requested
    'GET /events/:id returns 200': (r) => r.status === 200,
    'GET /events/:id returns correct event': (r) => JSON.parse(r.body as string).data.id === data.eventId,
  });

  sleep(1);
}

/**
 * teardown() is a k6 lifecycle function that runs exactly once after
 * all virtual users have finished. Used here to delete the event
 * created in setup() so test data does not accumulate in the sandbox.
 *
 * Receives the same data object returned from setup().
 */
export function teardown(data: { token: string; eventId: number }) {
  const headers = authHeaders(data.token);

  const deleteResponse = http.del(
    `${API_BASE_URL}/events/${data.eventId}`,
    null,
    { headers }
  );

  check(deleteResponse, {
    'teardown: event deleted successfully': (r) => r.status === 200,
  });
}