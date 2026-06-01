// tests/performance/events.perf.ts
import http2 from "k6/http";
import { check as check2, sleep } from "k6";

// src/performance/helpers/auth.helper.ts
import http from "k6/http";
import { check } from "k6";
var API_BASE_URL = __ENV.API_BASE_URL;
function getAuthToken() {
  const response = http.post(
    `${API_BASE_URL}/auth/login`,
    JSON.stringify({
      email: __ENV.TEST_EMAIL,
      password: __ENV.TEST_PASSWORD
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  check(response, {
    "login successful": (r) => r.status === 200,
    "token returned": (r) => JSON.parse(r.body).token !== void 0
  });
  const body = JSON.parse(response.body);
  return body.token;
}
function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

// src/performance/config/thresholds.ts
var thresholds = {
  // 95% of requests must complete under 2 seconds
  // 99% of requests must complete under 5 seconds
  http_req_duration: ["p(95)<2000", "p(99)<5000"],
  // less than 1% of requests can fail
  http_req_failed: ["rate<0.01"]
};

// src/performance/config/options.ts
var loadOptions = {
  // number of virtual users simulated concurrently
  vus: 10,
  // how long to sustain the load before stopping
  duration: "30s",
  // pass/fail criteria — test fails if any threshold is breached
  thresholds
};

// src/performance/data/test-data.ts
var eventPayload = {
  title: "Performance Test Event",
  description: "Created by performance test suite",
  category: "Conference",
  venue: "Test Venue",
  city: "Bangalore",
  eventDate: "2027-06-15T09:00:00.000Z",
  price: 500,
  totalSeats: 100
};

// tests/performance/events.perf.ts
var API_BASE_URL2 = __ENV.API_BASE_URL;
var options = loadOptions;
function setup() {
  const token = getAuthToken();
  const headers = authHeaders(token);
  const createResponse = http2.post(
    `${API_BASE_URL2}/events`,
    JSON.stringify(eventPayload),
    { headers }
  );
  check2(createResponse, {
    "setup: event created successfully": (r) => r.status === 201
  });
  const body = JSON.parse(createResponse.body);
  return {
    token,
    eventId: body.data.id
  };
}
function events_perf_default(data) {
  const headers = authHeaders(data.token);
  const listResponse = http2.get(`${API_BASE_URL2}/events`, { headers });
  check2(listResponse, {
    // check() validates the response — results are tracked in the k6 output
    // as pass/fail counts but do not stop the test on their own.
    // Thresholds defined in options.ts are what actually fail the test.
    "GET /events returns 200": (r) => r.status === 200,
    "GET /events returns data": (r) => JSON.parse(r.body).data.length > 0
  });
  sleep(1);
  const getResponse = http2.get(`${API_BASE_URL2}/events/${data.eventId}`, { headers });
  check2(getResponse, {
    // validates the correct event was returned by comparing the id
    // in the response against the id we requested
    "GET /events/:id returns 200": (r) => r.status === 200,
    "GET /events/:id returns correct event": (r) => JSON.parse(r.body).data.id === data.eventId
  });
  sleep(1);
}
function teardown(data) {
  const headers = authHeaders(data.token);
  const deleteResponse = http2.del(
    `${API_BASE_URL2}/events/${data.eventId}`,
    null,
    { headers }
  );
  check2(deleteResponse, {
    "teardown: event deleted successfully": (r) => r.status === 200
  });
}
export {
  events_perf_default as default,
  options,
  setup,
  teardown
};
