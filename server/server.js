import { env } from './config/env.js';

import { app } from './app.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  try {
    app.listen(env.PORT, () => {
      logger.info(
        `Server running on port ${env.PORT}\n` +
          `Local:   http://localhost:${env.PORT}\n` +
          `Health:  http://localhost:${env.PORT}/health`
      );
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
