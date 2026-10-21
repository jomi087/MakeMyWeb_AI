import { HTTP_STATUS } from '../constants/http.constants.js';
import { AppError } from '../errors/AppError.js';

export const validateRequest = (schema, location = 'body') => {
  return async (req, res, next) => {
    const data = req[location];

    if (data == null) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Missing required data');
    }

    const validatedData = await schema.parseAsync(req[location]);

    switch (location) {
      case 'body':
        req.validatedBody = validatedData;
        break;

      case 'query':
        req.validatedQuery = validatedData;
        break;

      case 'params':
        req.validatedParams = validatedData;
        break;

      case 'file':
        req.validatedFile = validatedData;
        break;

      case 'files':
        req.validatedFiles = validatedData;
        break;

      default:
        throw new Error(`Unsupported validation location: ${location}`);
    }

    next();
  };
};
