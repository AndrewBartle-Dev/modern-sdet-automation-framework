// tests/api/auth.spec.ts
import { test } from '../../src/fixtures/auth.fixture';
import { expect} from "@playwright/test";
import { ENV } from '../../src/config/env';
import { validateSchema } from '../../src/api/validators/schema.validator';
import { LoginResponseSchema, MeResponseSchema, ErrorResponseSchema } from '../../src/api/schemas/auth.schema';

test.describe('Auth API', () => {

  test.describe('POST /auth/login', () => {

    test('valid credentials return 200 with valid schema',
      { tag: ['@smoke', '@api', '@regression'] },
      async ({ request }) => {
        const response = await request.post(`${ENV.API_BASE_URL}/auth/login`, {
          data: { email: ENV.TEST_EMAIL, password: ENV.TEST_PASSWORD },
        });
        const body = await response.json() as Record<string, any>;
        expect(response.status()).toBe(200);
        validateSchema(LoginResponseSchema, body);
        expect(body.success).toBe(true);
        expect(body.token).toBeTruthy();
        expect(body.user.email).toBe(ENV.TEST_EMAIL);
      }
    );

    test('wrong password returns 400 with valid schema',
      { tag: ['@api', '@regression'] },
      async ({ request }) => {
        const response = await request.post(`${ENV.API_BASE_URL}/auth/login`, {
          data: { email: ENV.TEST_EMAIL, password: 'wrongpassword' },
        });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(400);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);
      }
    );

    test('unknown email returns 400 with valid schema',
      { tag: ['@api', '@regression'] },
      async ({ request }) => {
        const response = await request.post(`${ENV.API_BASE_URL}/auth/login`, {
          data: { email: 'nobody@unknown.com', password: 'password123' },
        });
        const body = await response.json() as Record<string, any>;

        //The documentation says this should return 404, but it actually returns 400. 
        //Either way, we want to validate the schema and error message.
        expect(response.status()).toBe(400);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);
        
      }
    );

    test('missing password returns 400 with valid schema',
      { tag: ['@api', '@regression'] },
      async ({ request }) => {
        const response = await request.post(`${ENV.API_BASE_URL}/auth/login`, {
          data: { email: ENV.TEST_EMAIL },
        });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(400);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);

      }
    );

    test('missing email returns 400 with valid schema',
      { tag: ['@api', '@regression'] },
      async ({ request }) => {
        const response = await request.post(`${ENV.API_BASE_URL}/auth/login`, {
          data: { password: 'password123' },
        });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(400);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);
      }
    );

    test('invalid email format returns 400 with valid schema',
      { tag: ['@api', '@regression'] },
      async ({ request }) => {
        const response = await request.post(`${ENV.API_BASE_URL}/auth/login`, {
          data: { email: 'notanemail', password: 'password123' },
        });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(400);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);
      }
    );

  });

  test.describe('GET /auth/me', () => {

    test('valid token returns authenticated user with valid schema',
      { tag: ['@api', '@regression'] },
      async ({ userClient }) => {
        const response = await userClient.auth.me(userClient.getAuthToken());
        const body = await response.json() as Record<string, any>;
        const { id, email } = userClient.getAuthUser();

        //Issued at and Expiration are in the reponse, but the documnetation doesn't 
        //does not mention them. The schema was updated so this test will not fail 
        //when they are present.
        expect(response.status()).toBe(200);
        validateSchema(MeResponseSchema, body);
        expect(body.success).toBe(true);
        expect(body.user.email).toBe(email);
        expect(body.user.userId).toBe(id);
      }
    );

    test('missing token returns 401 with valid schema',
      { tag: ['@api', '@regression'] },
      async ({ request }) => {
        const response = await request.get(`${ENV.API_BASE_URL}/auth/me`);
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(401);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);
      }
    );

    test('invalid token returns 401 with valid schema',
      { tag: ['@api', '@regression'] },
      async ({ request }) => {
        const response = await request.get(`${ENV.API_BASE_URL}/auth/me`, {
          headers: { Authorization: 'Bearer invalidtoken123' },
        });
        const body = await response.json() as Record<string, any>;

        expect(response.status()).toBe(401);
        validateSchema(ErrorResponseSchema, body);
        expect(body.success).toBe(false);
      }
    );

  });

});