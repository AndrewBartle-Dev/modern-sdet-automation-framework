// src/types/api.types.ts

export interface Event {
  id: number;
  title: string;
  description: string;
  category: 'Conference' | 'Concert' | 'Sports' | 'Workshop' | 'Festival';
  venue: string;
  city: string;
  eventDate: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  eventId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  bookingRef: string;
  createdAt: string;
  updatedAt: string;
  event: Event;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Request payloads
export interface CreateEventPayload {
  title: string;
  description: string;
  category: string;
  venue: string;
  city: string;
  eventDate: string;
  price: number;
  totalSeats: number;
  imageUrl?: string; // optional — confirmed by actual API behaviour which does not match the documentation
}

export interface CreateBookingPayload {
  eventId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
}

export interface EventsQueryParams {
  category?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface BookingsQueryParams {
  eventId?: number;
  status?: 'confirmed' | 'cancelled';
  page?: number;
  limit?: number;
}