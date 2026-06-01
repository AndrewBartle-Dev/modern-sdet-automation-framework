import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { ENV } from '../../config/env';
import { type CreateBookingPayload, type BookingsQueryParams } from '../contracts/api.contracts';
import { buildQueryParams } from '../../utils/request.utils';

/**
 * Handles all /bookings endpoints.
 * Methods return raw APIResponse so callers can assert on status codes,
 * headers, and body — including negative test scenarios.
 */
export class BookingsService {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token: string = ''
  ) {}

  private get headers(): Record<string, string> {
    return this.token
      ? { Authorization: `Bearer ${this.token}` }
      : {};
  }

  /**
   * GET /bookings
   * Returns a paginated list of bookings, each including full event details.
   * Supports optional filtering by eventId, status, page, and limit.
   */
  async getAll(params?: BookingsQueryParams): Promise<APIResponse> {
    return this.request.get(`${ENV.API_BASE_URL}/bookings`, {
      headers: this.headers,
      params: buildQueryParams(params),
    });
  }

  /**
   * GET /bookings/:id
   * Returns a single booking by numeric ID.
   * Expect 404 if the booking does not exist.
   */
  async getById(id: number): Promise<APIResponse> {
    return this.request.get(`${ENV.API_BASE_URL}/bookings/${id}`, {
      headers: this.headers,
    });
  }

  /**
   * GET /bookings/ref/:ref
   * Looks up a booking by its unique reference code (e.g. EVT-A1B2C3).
   * Useful for verifying a booking after creation without storing the numeric ID.
   */
  async getByRef(ref: string): Promise<APIResponse> {
    return this.request.get(`${ENV.API_BASE_URL}/bookings/ref/${ref}`, {
      headers: this.headers,
    });
  }

  /**
   * POST /bookings
   * Creates a booking and atomically decrements availableSeats on the event.
   * Returns 400 if quantity exceeds availableSeats.
   */
  async create(payload: CreateBookingPayload): Promise<APIResponse> {
    return this.request.post(`${ENV.API_BASE_URL}/bookings`, {
      headers: this.headers,
      data: payload,
    });
  }

  /**
   * DELETE /bookings/:id
   * Cancels a booking and atomically restores seats back to the event.
   * Expect 404 if the booking does not exist.
   */
  async cancel(id: number): Promise<APIResponse> {
    return this.request.delete(`${ENV.API_BASE_URL}/bookings/${id}`, {
      headers: this.headers,
    });
  }
}