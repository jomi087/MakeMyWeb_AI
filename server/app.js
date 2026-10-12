import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { corsOptions } from './config/cors.js';
import { HTTP_STATUS } from './constants/http.constants.js';
import { SUCCESS_MESSAGES } from './constants/messages.constants.js';
import { sendSuccess } from './utils/apiResponse.js';
import { SERVER_CONFIG } from './config/server.js';
import { errorHandler } from './middleware/errorhandler.js';
import RequestLoggerMiddleware from './middleware/requestLoggerMiddleware.js';

export const app = express();

app.use(RequestLoggerMiddleware);

app.use(cors(corsOptions));
app.use(express.json({ limit: SERVER_CONFIG.BODY_LIMIT }));
app.use(
  express.urlencoded({ extended: true, limit: SERVER_CONFIG.URLENCODED_LIMIT })
);
app.use(cookieParser());

app.get('/health', (req, res) => {
  sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.SERVER_RUNNING);
});

app.use(errorHandler);
