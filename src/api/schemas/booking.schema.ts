// src/api/schemas/booking.schema.ts
import { EventSchema } from './event.schema';

export const BookingSchema = {
  type: 'object',
  required: ['id', 'eventId', 'customerName', 'customerEmail', 'customerPhone',
             'quantity', 'totalPrice', 'status', 'bookingRef', 'createdAt', 'updatedAt', 'event'],
  properties: {
    id:            { type: 'number' },
    eventId:       { type: 'number' },
    customerName:  { type: 'string' },
    customerEmail: { type: 'string', format: 'email' },
    customerPhone: { type: 'string' },
    quantity:      { type: 'number', minimum: 1, maximum: 10 },
    totalPrice:    { type: 'number' },
    status:        { type: 'string', enum: ['confirmed', 'cancelled'] },
    bookingRef:    { type: 'string', pattern: '^EVT-[A-Z0-9]{6}$' },
    createdAt:     { type: 'string', format: 'date-time' },
    updatedAt:     { type: 'string', format: 'date-time' },
    event:         EventSchema,
  },
  additionalProperties: false,
};

export const BookingResponseSchema = {
  type: 'object',
  required: ['success', 'data'],
  properties: {
    success: { type: 'boolean', const: true },
    data:    BookingSchema,
  },
};

export const BookingsListResponseSchema = {
  type: 'object',
  required: ['success', 'data', 'pagination'],
  properties: {
    success:    { type: 'boolean', const: true },
    data:       { type: 'array', items: BookingSchema },
    pagination: {
      type: 'object',
      required: ['total', 'page', 'limit', 'totalPages'],
      properties: {
        total:      { type: 'number' },
        page:       { type: 'number' },
        limit:      { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  },
};