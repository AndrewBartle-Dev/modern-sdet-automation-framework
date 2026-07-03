// tests/api/events.spec.ts
import { test } from "../../src/fixtures/auth.fixture";
import { expect} from "@playwright/test";
import { validateSchema } from "../../src/api/validators/schema.validator";
import {
  EventResponseSchema,
  EventsListResponseSchema,
} from "../../src/api/schemas/event.schema";
import { EventCategory } from "../../src/api/contracts/api.contracts";

test.describe("Events API", () => { 

  test.describe("GET /events", () => {
    test(
      "returns paginated event list with valid schema",
      { tag: ["@smoke", "@api", "@regression"] },
      async ({ userClient }) => {
        const response = await userClient.events.getAll();
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(200);
        validateSchema(EventsListResponseSchema, body);
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.pagination.page).toBe(1);
        expect(body.pagination.limit).toBe(10);
      },
    );

    test(
      "filters by category",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const response = await userClient.events.getAll({
          category: "Conference" as EventCategory,
        });
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(200);
        body.data.forEach((event: any) => {
          expect(event.category).toBe("Conference");
        });
      },
    );

    test(
      "filters by city",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const response = await userClient.events.getAll({ city: "Bangalore" });
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(200);
        body.data.forEach((event: any) => {
          expect(event.city).toBe("Bangalore");
        });
      },
    );

    test(
      "respects page and limit params",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const response = await userClient.events.getAll({ page: 1, limit: 3 });
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(200);
        expect(body.data.length).toBeLessThanOrEqual(3);
        expect(body.pagination.page).toBe(1);
        expect(body.pagination.limit).toBe(3);
      },
    );
  });

  test.describe("GET /events/:id", () => {
    test(
      "returns single event with valid schema",
      { tag: ["@smoke", "@api", "@regression"] },
      async ({ userClient }) => {
        const listResponse = await userClient.events.getAll();
        const listBody = (await listResponse.json()) as Record<string, any>;
        const eventId = listBody.data[0].id;

        const response = await userClient.events.getById(eventId);
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(200);
        validateSchema(EventResponseSchema, body);
        expect(body.data.id).toBe(eventId);
      },
    );

    test(
      "returns 404 for unknown id",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const response = await userClient.events.getById(999999);
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(404);
        expect(body.success).toBe(false);
      },
    );
  });

  test.describe("POST /events", () => {
    test(
      "creates event and returns 201 with valid schema",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const payload = {
          title: "Automation Test Event",
          description: "Created by automated test suite",
          category: 'Conference' as EventCategory,
          venue: "Test Venue",
          city: "Bangalore",
          eventDate: "2027-01-15T09:00:00.000Z",
          price: 500,
          totalSeats: 100,
        };

        const response = await userClient.events.create(payload);
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(201);
        validateSchema(EventResponseSchema, body);
        expect(body.data.title).toBe(payload.title);
        expect(body.data.availableSeats).toBe(payload.totalSeats);
        expect(body.message).toBe("Event created successfully");
        await userClient.events.delete(body.data.id);
      },
    );

    test(
      "returns 400 when required fields are missing",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const response = await userClient.events.create({
          title: "Incomplete Event",
        } as any);
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(400);
        expect(body.success).toBe(false);
      },
    );
  });

  test.describe("PUT /events/:id", () => {
    test(
      "updates event and returns updated data",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const created = await userClient.events.create({
          title: "Event To Update",
          description: "Will be updated",
          category: "Workshop" as EventCategory,
          venue: "Test Venue",
          city: "Mumbai",
          eventDate: "2027-02-15T09:00:00.000Z",
          price: 200,
          totalSeats: 50,
        });
        expect(created.status()).toBe(201);
        const createdBody = (await created.json()) as Record<string, any>;
        const eventId = createdBody.data.id;

        const response = await userClient.events.update(eventId, {
          title: "Updated Event Title",
          description: "Will be updated",
          category: "Workshop" as EventCategory,
          venue: "Test Venue",
          city: "Mumbai",
          eventDate: "2027-02-15T09:00:00.000Z",
          price: 200,
          totalSeats: 50,
        });
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(200);
        validateSchema(EventResponseSchema, body);
        expect(body.data.title).toBe("Updated Event Title");
        expect(body.message).toBe("Event updated successfully");
        await userClient.events.delete(eventId);
      },
    );

    test(
      "returns 404 for unknown id",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const response = await userClient.events.update(999999, {
          title: "Ghost Event",
          description: "Does not exist",
          category: "Conference" as EventCategory,
          venue: "Nowhere",
          city: "Nowhere",
          eventDate: "2027-01-15T09:00:00.000Z",
          price: 100,
          totalSeats: 10,
        });
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(404); 
        expect(body.success).toBe(false);
      },
    );
  });

  test.describe("DELETE /events/:id", () => {
    test(
      "deletes event and returns success message",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const created = await userClient.events.create({
          title: "Event To Delete",
          description: "Will be deleted",
          category: "Festival" as EventCategory,
          venue: "Test Venue",
          city: "Chennai",
          eventDate: "2027-03-15T09:00:00.000Z",
          price: 100,
          totalSeats: 200,
        });
        const createdBody = (await created.json()) as Record<string, any>;
        const eventId = createdBody.data.id;

        const response = await userClient.events.delete(eventId);
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Event deleted successfully");
      },
    );

    test(
      "deleted event is no longer retrievable",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const created = await userClient.events.create({
          title: "Event To Delete And Verify",
          description: "Will be deleted",
          category: "Concert" as EventCategory,
          venue: "Test Venue",
          city: "Delhi",
          eventDate: "2027-04-15T09:00:00.000Z",
          price: 300,
          totalSeats: 150,
        });
        const createdBody = (await created.json()) as Record<string, any>;
        const eventId = createdBody.data.id;

        await userClient.events.delete(eventId);

        const getResponse = await userClient.events.getById(eventId);
        expect(getResponse.status()).toBe(404);
      },
    );

    test(
      "returns 404 for unknown id",
      { tag: ["@api", "@regression"] },
      async ({ userClient }) => {
        const response = await userClient.events.delete(999999);
        const body = (await response.json()) as Record<string, any>;

        expect(response.status()).toBe(404);
        expect(body.success).toBe(false);
      },
    );
  });
});
