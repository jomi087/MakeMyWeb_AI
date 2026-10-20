import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { ERROR_MESSAGES } from '../constants/messages.constants.js';
import { AppError } from '../errors/AppError.js';
import { env } from '../config/env.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
    //console.log(payload) // payload {userId: string, email: string}

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return next(
          new AppError(
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_MESSAGES.SESSION_TOKEN_EXPIRED
          )
        );
      }

      if (error.name === 'JsonWebTokenError' || error.name === 'SyntaxError') {
        return next(
          new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN)
        );
      }
    }

    next(error);
  }
};
