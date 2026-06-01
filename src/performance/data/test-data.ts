// src/performance/data/test-data.ts
import { type EventCategory, type CreateEventPayload, type CreateBookingPayload } from '../../api/contracts/api.contracts';

/**
 * Static test data for performance tests.
 * Defined here so payloads are consistent across all performance test files
 * and can be updated in one place if the API contract changes.
 *
 * Types are imported from api.contracts.ts — esbuild bundles the
 * TypeScript types at compile time making them available across runtimes.
 */

export const eventPayload: CreateEventPayload = {
  title: 'Performance Test Event',
  description: 'Created by performance test suite',
  category: 'Conference' as EventCategory,
  venue: 'Test Venue',
  city: 'Bangalore',
  eventDate: '2027-06-15T09:00:00.000Z',
  price: 500,
  totalSeats: 100,
};

export const bookingPayload = (eventId: number): CreateBookingPayload => ({
  eventId,
  customerName: 'Perf Test User',
  customerEmail: 'perftest@example.com',
  customerPhone: '+91-9876543210',
  quantity: 1,
});