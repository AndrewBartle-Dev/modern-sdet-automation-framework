// src/data/ui-test-mock-data/booking.mock.ts

/**
 * Mock data for booking page UI tests.
 * Centralised here so tests stay clean and mock responses
 * can be updated in one place if the API contract changes.
 */

export const mockBookingEvent = {
  /**
   * Standard event response for happy path booking tests.
   * Matches the actual API response shape including all fields
   * returned by the real API (price as string, isStatic, userId).
   */
  techSummit: {
    success: true,
    data: {
      id: 1,
      title: 'Tech Summit 2027',
      description: 'A premier technology conference.',
      category: 'Conference',
      venue: 'Bangalore International Centre',
      city: 'Bangalore',
      eventDate: '2027-06-15T09:00:00.000Z',
      price: '1500',
      totalSeats: 500,
      availableSeats: 342,
      imageUrl: 'https://example.com/tech-summit.jpg',
      isStatic: true,
      userId: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  },

  /**
   * Sold out event — tests how the UI handles no available seats.
   */
  soldOut: {
    success: true,
    data: {
      id: 2,
      title: 'Sold Out Event',
      description: 'This event is sold out.',
      category: 'Concert',
      venue: 'Test Venue',
      city: 'Mumbai',
      eventDate: '2027-07-15T09:00:00.000Z',
      price: '2500',
      totalSeats: 100,
      availableSeats: 0,
      imageUrl: null,
      isStatic: false,
      userId: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  },
};

export const mockBookingResponse = {
  /**
   * Successful booking confirmation response.
   * Used to verify the confirmation state renders correctly
   * without creating real bookings in the sandbox.
   */
  confirmed: {
    success: true,
    data: {
      id: 1001,
      eventId: 1,
      customerName: 'QA Automation User',
      customerEmail: 'test@mockuser.com',
      customerPhone: '9876543210',
      quantity: 1,
      totalPrice: 1500,
      status: 'confirmed',
      bookingRef: 'B-MOCKREF',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      event: {
        id: 1,
        title: 'Tech Summit 2027',
        description: 'A premier technology conference.',
        category: 'Conference',
        venue: 'Bangalore International Centre',
        city: 'Bangalore',
        eventDate: '2027-06-15T09:00:00.000Z',
        price: 1500,
        totalSeats: 500,
        availableSeats: 340,
        imageUrl: 'https://example.com/tech-summit.jpg',
        isStatic: true,
        userId: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
    message: 'Booking confirmed!',
  },

  /**
   * Insufficient seats error — tests how the UI handles a failed booking.
   */
  insufficientSeats: {
    success: false,
    error: 'Validation failed',
    details: [
      {
        field: 'quantity',
        message: 'Not enough seats available',
      },
    ],
  },
};