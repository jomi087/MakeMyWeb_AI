import { HTTP_STATUS } from '../constants/http.constants.js';
import { AppError } from '../errors/AppError.js';

export const validateRequest = (schema, location = 'body') => {
  return async (req, res, next) => {
    const data = req[location];

    if (data == null) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Missing required data');
    }

    const validatedData = await schema.parseAsync(req[location]);

    if (location === 'query') {
      req.validatedQuery = validatedData;
    } else if (location !== 'file' && location !== 'files') {
      Object.assign(req[location], validatedData);
    }

    next();
  };
};
