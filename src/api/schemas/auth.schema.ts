// src/api/schemas/auth.schema.ts

export const LoginResponseSchema = {
  type: "object",
  required: ["success", "token", "user"],
  properties: {
    success: { type: "boolean", const: true },
    token: { type: "string", minLength: 1 },
    user: {
      type: "object",
      required: ["id", "email"],
      properties: {
        id: { type: "number" },
        email: { type: "string", format: "email" },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

export const MeResponseSchema = {
  type: "object",
  required: ["success", "user"],
  properties: {
    success: { type: "boolean", const: true },
    user: {
      type: "object",
      required: ["userId", "email"],
      properties: {
        userId: { type: "number" },
        email: { type: "string", format: "email" },
        iat: { type: "number" },
        exp: { type: "number" },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

export const ErrorResponseSchema = {
  type: "object",
  required: ["success", "error"],
  properties: {
    success: { type: "boolean", const: false },
    error: { type: "string", minLength: 1 },
    details: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string" },
          message: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
};
