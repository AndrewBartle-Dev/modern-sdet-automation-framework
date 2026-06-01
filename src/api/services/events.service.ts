import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { ENV } from '../../config/env';
import { type CreateEventPayload, type EventsQueryParams } from '../contracts/api.contracts';
import { buildQueryParams } from '../../utils/request.utils';

/**
 * Handles all /events endpoints.
 * Methods return raw APIResponse so callers can assert on status codes,
 * headers, and body — including negative test scenarios.
 */
export class EventsService {
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
   * GET /events
   * Returns a paginated list of events.
   * Supports optional filtering by category, city, search term, page, and limit.
   */
  async getAll(params?: EventsQueryParams): Promise<APIResponse> {
    return this.request.get(`${ENV.API_BASE_URL}/events`, {
      headers: this.headers,
      params: buildQueryParams(params),
    });
  }

  /**
   * GET /events/:id
   * Returns a single event by numeric ID.
   * Expect 404 if the event does not exist.
   */
  async getById(id: number): Promise<APIResponse> {
    return this.request.get(`${ENV.API_BASE_URL}/events/${id}`, {
      headers: this.headers,
    });
  }

  /**
   * POST /events
   * Creates a new event. availableSeats is automatically set to totalSeats by the API.
   * Requires all fields defined in CreateEventPayload.
   */
  async create(payload: CreateEventPayload): Promise<APIResponse> {
    return this.request.post(`${ENV.API_BASE_URL}/events`, {
      headers: this.headers,
      data: payload,
    });
  }

  /**
   * PUT /events/:id
   * Updates an existing event. Uses CreateEventPayload so all fields need to be provided.
   */
  async update(id: number, payload: CreateEventPayload): Promise<APIResponse> {
    return this.request.put(`${ENV.API_BASE_URL}/events/${id}`, {
      headers: this.headers,
      data: payload,
    });
  }

  /**
   * DELETE /events/:id
   * Permanently deletes an event and all associated bookings (cascade).
   * Expect 404 if the event does not exist.
   */
  async delete(id: number): Promise<APIResponse> {
    return this.request.delete(`${ENV.API_BASE_URL}/events/${id}`, {
      headers: this.headers,
    });
  }
}