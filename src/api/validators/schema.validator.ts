// src/api/validators/schema.validator.ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateSchema<T>(schema: object, data: unknown): asserts data is T {
  const valid = ajv.validate(schema, data);
  if (!valid) {
    throw new Error(
      `Schema validation failed:\n${ajv.errorsText(ajv.errors, { separator: '\n' })}`
    );
  }
}