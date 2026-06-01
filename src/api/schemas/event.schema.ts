// src/api/schemas/event.schema.ts
export const EventSchema = {
  type: "object",
  required: [
    "id",
    "title",
    "description",
    "category",
    "venue",
    "city",
    "eventDate",
    "price",
    "totalSeats",
    "availableSeats",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    id: { type: "number" },
    title: { type: "string" },
    description: { type: "string" },
    category: {
      type: "string",
      enum: ["Conference", "Concert", "Sports", "Workshop", "Festival"],
    },
    venue: { type: "string" },
    city: { type: "string" },
    eventDate: { type: "string", format: "date-time" },
    price: { type: "string" },
    totalSeats: { type: "number" },
    availableSeats: { type: "number" },
    imageUrl: { type: ["string", "null"] },
    isStatic: { type: "boolean" }, // undocumented field
    userId: { type: ["number", "null"] }, // undocumented field
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  additionalProperties: false,
};

export const EventsListResponseSchema = {
  type: "object",
  required: ["success", "data", "pagination"],
  properties: {
    success: { type: "boolean", const: true },
    data: { type: "array", items: EventSchema },
    pagination: {
      type: "object",
      required: ["total", "page", "limit", "totalPages"],
      properties: {
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
        totalPages: { type: "number" },
      },
    },
  },
};

export const EventResponseSchema = {
  type: "object",
  required: ["success", "data"],
  properties: {
    success: { type: "boolean", const: true },
    data: EventSchema,
  },
};
