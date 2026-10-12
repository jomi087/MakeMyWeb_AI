import { randomUUID } from 'node:crypto';
import { logger } from '../config/logger.js';

const RequestLoggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const requestId = randomUUID();

  // Attach requestId to the request so controllers/services can access it
  req.requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') ?? '-';
    const contentLength = res.get('content-length') ?? '0';
    const { statusCode } = res;

    /*
      Industry-standard HTTP access log fields:
      - requestId:     ties all logs for one request together
      - method:        GET, POST, PATCH, DELETE
      - url:           the route hit
      - statusCode:    200, 404, 500, etc.
      - duration:      how long the request took (ms)
      - contentLength: response size in bytes
      - ip:            client IP (useful for rate-limiting investigations)
      - userAgent:     helps identify bots vs browsers
    */

    logger.info(
      `test-logger: ${method} ${originalUrl} ${statusCode} ${duration}ms ${contentLength}b` +
        ` — ${ip} "${userAgent}" [${requestId}]`
    );
  });

  next();
};

export default RequestLoggerMiddleware;
