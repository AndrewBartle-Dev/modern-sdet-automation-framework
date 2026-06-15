// src/api/clients/eventHubUserClient.ts
import { type APIRequestContext } from '@playwright/test';
import { ENV } from '../../config/env';
import { AuthService } from '../services/auth.service';
import { EventsService } from '../services/events.service';
import { BookingsService } from '../services/bookings.service';

/**
 * Represents an authenticated EventHub user.
 * Composes domain services so tests interact via userClient.events.getAll()
 * rather than calling services directly — keeps tests readable and decoupled
 * from the HTTP layer.
 */
export class EventHubUserClient {
  readonly auth: AuthService;
  events: EventsService;
  bookings: BookingsService;
  private token = '';
  private userId = 0;
  private userEmail = '';

  constructor(private readonly request: APIRequestContext) {
    this.auth = new AuthService(request);
    this.events = new EventsService(request);
    this.bookings = new BookingsService(request);
  }

  /**
   * Authenticates the client using credentials from ENV.
   * Reinitialises services with the auth token after login so all
   * subsequent requests include the Authorization header automatically.
   * Called as a fallback when the cached token is missing or expired.
   */
  async authenticate(): Promise<void> {
    const { token, id, email } = await this.auth.login(
      ENV.TEST_EMAIL,
      ENV.TEST_PASSWORD,
    );

    this.token = token;
    this.userId = id;
    this.userEmail = email;

    this.events = new EventsService(this.request, this.token);
    this.bookings = new BookingsService(this.request, this.token);
  }

  /**
   * Hydrates the client from a cached auth state without hitting the API.
   * Called by the fixture when a valid cached token is available.
   * Reinitialises services with the token so all requests are authenticated.
   */
  authenticateWithToken(token: string, id: number, email: string): void {
    this.token = token;
    this.userId = id;
    this.userEmail = email;

    this.events = new EventsService(this.request, this.token);
    this.bookings = new BookingsService(this.request, this.token);
  }

  /**
   * Returns the JWT token acquired during authenticate() or authenticateWithToken().
   * Used by the authenticatedPage fixture to inject into localStorage.
   * Throws if called before authentication.
   */
  getAuthToken(): string {
    if (!this.token) throw new Error('Client is not authenticated.');
    return this.token;
  }

  /**
   * Returns the authenticated user's id and email.
   * Throws if called before authentication.
   */
  getAuthUser(): { id: number; email: string } {
    if (!this.userId) throw new Error('Client is not authenticated.');
    return { id: this.userId, email: this.userEmail };
  }
}