import { type APIRequestContext, type APIResponse } from "@playwright/test";
import { ENV } from "../../config/env";

/**
 * Handles all authentication endpoints.
 * login() returns token, id, and email directly rather than APIResponse —
 * callers need these values for fixtures and assertions, not the HTTP details.
 */
export class AuthService {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * POST /auth/login
   * Returns the JWT token, user id, and email on success.
   * Throws if login fails — a bad login in a fixture is always a setup problem.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; id: number; email: string }> {
    const response = await this.request.post(`${ENV.API_BASE_URL}/auth/login`, {
      data: { email, password },
    });

    if (!response.ok()) {
      throw new Error(
        `Login failed: ${response.status()} ${response.statusText()}`,
      );
    }

    const body = await response.json();

    return {
      token: body.token,
      id: body.user.id,
      email: body.user.email,
    };
  }

  /**
   * GET /auth/me
   * Validates the current bearer token and returns the authenticated user identity.
   * Useful for verifying the token injected by the fixture is still valid.
   */
  async me(token: string): Promise<APIResponse> {
    return this.request.get(`${ENV.API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
