import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';
import { SUCCESS_MESSAGES } from '../constants/messages.constants.js';

export const connectDB = async () => {
  const mongoUrl = env.DB_URI;
  mongoose.connection.on('connected', () => logger.info(SUCCESS_MESSAGES.DB_CONNECTED))
  await mongoose.connect(mongoUrl);
};
