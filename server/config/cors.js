import { ERROR_MESSAGES } from '../constants/messages.constants.js';
import { env } from './env.js';

const allowedOrigins = [env.FRONTEND_URL];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(ERROR_MESSAGES.CORS_NOT_ALLOWED));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
