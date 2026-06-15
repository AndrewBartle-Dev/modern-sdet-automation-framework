// tests/api/bookings.spec.ts
import { test } from '../../src/fixtures/auth.fixture';
import { expect} from "@playwright/test";
import { validateSchema } from '../../src/api/validators/schema.validator';
import { BookingResponseSchema, BookingsListResponseSchema } from '../../src/api/schemas/booking.schema';
import { ErrorResponseSchema } from '../../src/api/schemas/auth.schema';
import { EventHubUserClient } from '../../src/api/clients/eventHubUserClient';

test.describe('Bookings API', () => {

  // helper to create a fresh event for booking tests
  async function createTestEvent(userClient: EventHubUserClient) {
    const response = await userClient.events.create({
      title: 'Bookable Test Event',
      description: 'Created for booking tests',
      category: 'Conference',
      venue: 'Test Venue',
      city: 'Bangalore',
      eventDate: '2027-06-15T09:00:00.000Z',
      price: 1000,
      totalSeats: 50,
    });
    const body = await response.json() as Record<string, any>;
    return body.data;
  }

  test.describe('POST /bookings', () => {

    test('creates booking and returns 201 with valid schema',
      { tag: ['@smoke', '@api', '@regression'] },
      async ({ userClient }) => {
        const event = await createTestEvent(userClient);

        const response = await userClient.bookings.create({
          eventId: event.id,
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+91-9876543210',
          quantity: 2,
        });
        const body = await response.json() as Record<string, any>;
        expect(response.status()).toBe(201);
        validateSchema(BookingResponseSchema, body);
        expect(body.data.status).toBe('confirmed');
        expect(body.data.quantity).toBe(2);
        expect(body.data.eventId).toBe(event.id);
        expect(body.data.bookingRef).toMatch(/^B-[A-Z0-9]{6}$/);
        expect(body.message).toBe('Booking confirmed!');
      }
    );

    test('booking decrements available seats on the event',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const event = await createTestEvent(userClient);
        const seatsBefore = event.availableSeats;

        await userClient.bookings.create({
          eventId: event.id,
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+91-9876543210',
          quantity: 3,
        });

        const updatedEvent = await userClient.events.getById(event.id);
        const updatedBody = await updatedEvent.json() as Record<string, any>;

        expect(updatedBody.data.availableSeats).toBe(seatsBefore - 3);
      }
    );

    test('returns 400 when quantity exceeds available seats',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const event = await createTestEvent(userClient);

        const response = await userClient.bookings.create({
          eventId: event.id,
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+91-9876543210',
          quantity: 999,
        });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(400);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);
      }
    );

    test('returns 400 when quantity is 0',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const event = await createTestEvent(userClient);

        const response = await userClient.bookings.create({
          eventId: event.id,
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+91-9876543210',
          quantity: 0,
        });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(400);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);
      }
    );

    test('returns 404 for unknown event id',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const response = await userClient.bookings.create({
          eventId: 999999,
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+91-9876543210',
          quantity: 1,
        });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(404);
        expect(body.success).toBe(false);
      }
    );

    test('returns 400 when required fields are missing',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const response = await userClient.bookings.create({
          eventId: 1,
        } as any);
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(400);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);
      }
    );

  });

  test.describe('GET /bookings', () => {

    test('returns paginated bookings list with valid schema',
      { tag: ['@smoke', '@api', '@regression'] },
      async ({ userClient }) => {
        const response = await userClient.bookings.getAll();
        const body = await response.json() as Record<string, any>;
        expect(response.status()).toBe(200);
        validateSchema(BookingsListResponseSchema, body);
        expect(body.pagination.page).toBe(1);
      }
    );

    test('filters by status confirmed',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const response = await userClient.bookings.getAll({ status: 'confirmed' });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(200);
        body.data.forEach((booking: any) => {
          expect(booking.status).toBe('confirmed');
        });
      }
    );

    test('respects page and limit params',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const response = await userClient.bookings.getAll({ page: 1, limit: 3 });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(200);
        expect(body.data.length).toBeLessThanOrEqual(3);
        expect(body.pagination.page).toBe(1);
        expect(body.pagination.limit).toBe(3);
      }
    );

  });

  test.describe('GET /bookings/:id', () => {

    test('returns single booking with valid schema',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const event = await createTestEvent(userClient);
        const created = await userClient.bookings.create({
          eventId: event.id,
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+91-9876543210',
          quantity: 1,
        });
        const createdBody = await created.json() as Record<string, any>;
        const bookingId = createdBody.data.id;

        const response = await userClient.bookings.getById(bookingId);
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(200);
        validateSchema(BookingResponseSchema, body);
        expect(body.data.id).toBe(bookingId);
      }
    );

    test('returns 404 for unknown id',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const response = await userClient.bookings.getById(999999);
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(404);
        expect(body.success).toBe(false);
      }
    );

  });

  test.describe('GET /bookings/ref/:ref', () => {

    test('returns booking by reference code',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const event = await createTestEvent(userClient);
        const created = await userClient.bookings.create({
          eventId: event.id,
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+91-9876543210',
          quantity: 1,
        });
        const createdBody = await created.json() as Record<string, any>;
        const bookingRef = createdBody.data.bookingRef;

        const response = await userClient.bookings.getByRef(bookingRef);
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(200);
        validateSchema(BookingResponseSchema, body);
        expect(body.data.bookingRef).toBe(bookingRef);
      }
    );

    test('returns 404 for unknown reference',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const response = await userClient.bookings.getByRef('EVT-XXXXXX');
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(404);
        expect(body.success).toBe(false);
      }
    );

  });

  test.describe('DELETE /bookings/:id', () => {

    test('cancels booking and restores seats to event',
      { tag: ['@smoke', '@api', '@regression'] },
      async ({ userClient }) => {
        const event = await createTestEvent(userClient);
        const quantity = 3;

        const created = await userClient.bookings.create({
          eventId: event.id,
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+91-9876543210',
          quantity,
        });
        const createdBody = await created.json() as Record<string, any>;
        const bookingId = createdBody.data.id;

        // verify seats were decremented
        const afterBooking = await userClient.events.getById(event.id);
        const afterBookingBody = await afterBooking.json() as Record<string, any>;
        expect(afterBookingBody.data.availableSeats).toBe(event.availableSeats - quantity);

        // cancel the booking
        const cancelResponse = await userClient.bookings.cancel(bookingId);
        const cancelBody = await cancelResponse.json() as Record<string, any>;

        expect(cancelResponse.status()).toBe(200);
        expect(cancelBody.success).toBe(true);
        expect(cancelBody.message).toBe('Booking cancelled');

        // verify seats were restored
        const afterCancel = await userClient.events.getById(event.id);
        const afterCancelBody = await afterCancel.json() as Record<string, any>;
        expect(afterCancelBody.data.availableSeats).toBe(event.availableSeats);
      }
    );

    test('returns 404 for unknown booking id',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const response = await userClient.bookings.cancel(999999);
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(404);
        expect(body.success).toBe(false);
      }
    );

  });

});