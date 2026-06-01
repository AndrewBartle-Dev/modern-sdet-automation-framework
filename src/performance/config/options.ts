// src/performance/config/options.ts
import { thresholds } from './thresholds';

/**
 * Smoke options — single user, single iteration.
 * Verifies the test script runs without errors before running under load.
 */
export const smokeOptions = {
  // number of virtual users simulated concurrently
  vus: 1,

  // total number of times the test function will execute
  iterations: 1,

  // pass/fail criteria — test fails if any threshold is breached
  thresholds,
};

/**
 * Load options — simulates normal expected traffic
 * with realistic concurrent users over a sustained period.
 */
export const loadOptions = {
  // number of virtual users simulated concurrently
  vus: 10,

  // how long to sustain the load before stopping
  duration: '30s',

  // pass/fail criteria — test fails if any threshold is breached
  thresholds,
};