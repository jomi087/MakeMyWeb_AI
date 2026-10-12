import dotenv from 'dotenv';
import { z } from 'zod';
import { ERROR_MESSAGES } from '../constants/messages.constants.js';

const nodeEnvSchema = z.enum(['development', 'production']);
const nodeEnv = nodeEnvSchema.parse(process.env.NODE_ENV); //parse will throw error if node_env failes whilre comparing with nodeEnvSchema
console.log('nodeEnv', nodeEnv);

dotenv.config({
  path: `.env.${nodeEnv}`,
  // quiet: true, //supresss it if you dont was to dislay in terminal
  // debug: true // for debugging
});

const baseSchema = z.object({
  PORT: z.coerce.number(),
  FRONTEND_URL: z.url({ error: ERROR_MESSAGES.MISSING_FRONTEND_URL, }),
  ALLOWED_ORIGINS: z.string().min(1, { error: ERROR_MESSAGES.ALLOWED_ORIGINS })
    .refine((value) => value.split(',')
      .map((origin) => origin.trim())
      .every((origin) => {
        try {
          new URL(origin);
          return true;
        } catch {
          return false;
        }
      }),
      { error: ERROR_MESSAGES.ALLOWED_ORIGINS },
  ), 
  DB_URI: z.string().min(1, ERROR_MESSAGES.MISSING_DB_URI),
});

// Extend the base schema when an environment requires additional
// variables or different validation rules. Different environment values
const developmentSchema = baseSchema.extend({});
const productionSchema = baseSchema.extend({});

const schemas = {
  development: developmentSchema,
  production: productionSchema,
};

const envSchema = schemas[nodeEnv];

export const env = envSchema.parse(process.env);
