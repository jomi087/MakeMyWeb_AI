import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { ERROR_MESSAGES } from '../constants/messages.constants.js';
import { logger } from '../config/logger.js';
import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  // If the response has already started, delegate to Express.
  if (res.headersSent) {
    return next(err);
  }

  //validation / validation error
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.VALIDATION_FAILED,
      errors
    );
  }

  // expected / custom errors
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  // Unexpected errors
  const statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const clientMessage = ERROR_MESSAGES.SOMETHING_WENT_WRONG;

  logger.error({
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : 'Not available',
    },
  });

  return sendError(res, statusCode, clientMessage);
};
