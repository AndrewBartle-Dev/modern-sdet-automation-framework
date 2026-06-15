// tests/ui/data/home.mock.ts

/**
 * Mock data for home page UI tests.
 * Centralised here so tests stay clean and mock responses
 * can be updated in one place if the API contract changes.
 */

export const mockAuthMe = {
  /**
   * Standard authenticated user response.
   * Controls the email displayed in the navigation bar.
   */
  authenticatedUser: {
    success: true,
    user: {
      userId: 1,
      email: 'test@mockuser.com',
      iat: 1234567890,
      exp: 9999999999,
    },
  },
};

export const mockEvents = {
  /**
   * Standard list of three events for happy path tests.
   * Mirrors the actual API response shape including all fields
   * returned by the real API (price as string, isStatic, userId).
   */
  threeEvents: {
    success: true,
    data: [
      {
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
      {
        id: 2,
        title: 'Monsoon Music Night',
        description: 'Live music under the stars.',
        category: 'Concert',
        venue: 'NSCI SVP Stadium',
        city: 'Mumbai',
        eventDate: '2027-07-11T19:00:00.000Z',
        price: '2500',
        totalSeats: 3000,
        availableSeats: 2800,
        imageUrl: 'https://example.com/concert.jpg',
        isStatic: true,
        userId: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 3,
        title: 'Dilli Diwali Mela',
        description: 'Celebrate the Festival of Lights.',
        category: 'Festival',
        venue: 'Pragati Maidan Exhibition Grounds',
        city: 'Delhi',
        eventDate: '2027-10-20T17:00:00.000Z',
        price: '300',
        totalSeats: 10000,
        availableSeats: 10000,
        imageUrl: 'https://example.com/diwali.jpg',
        isStatic: true,
        userId: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  },

  /**
   * Single event — tests minimum viable events list.
   */
  singleEvent: {
    success: true,
    data: [
      {
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
    ],
  },

  /**
   * Empty events list — tests how the UI handles no available events.
   * Impossible to reproduce within the UI since the 3 static events
   * cannot be deleted, making this a valuable mock-only test case.
   */
  empty: {
    success: true,
    data: [],
  },
};