// createApp() returns a configured Express application.
// Importing this file MUST NOT open a TCP port — .listen() lives in server.ts.
// Middleware runs in the order it is registered (see Activity 1):
// requestId → logger → express.json → routers → notFound → errorHandler.

import express from 'express';
import type { Application } from 'express';

import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import { notFound } from './middlewares/notFound.js';
import { requestId } from './middlewares/requestId.js';
import { articlesRouter } from './routes/articles.js';
import { healthRouter } from './routes/health.js';

export function createApp(): Application {
  const app = express();

  app.use(requestId); // first: everything after it can read req.requestId
  app.use(logger);
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/v1/articles', articlesRouter);

  app.use(notFound); // only reached when no router answered
  app.use(errorHandler); // always last

  return app;
}
