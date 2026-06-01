import dotenv from 'dotenv';

dotenv.config({ quiet: true });

// Fail fast if required environment variables are missing.
const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}`
    );
  }

  return value;
};

export const ENV = {
  BASE_URL: getRequiredEnv('BASE_URL'),
  API_BASE_URL: getRequiredEnv('API_BASE_URL'),
  TEST_EMAIL: getRequiredEnv('TEST_EMAIL'),
  TEST_PASSWORD: getRequiredEnv('TEST_PASSWORD'),
};