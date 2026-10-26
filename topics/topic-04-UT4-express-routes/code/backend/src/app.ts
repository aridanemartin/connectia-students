// createApp() returns a configured Express application.
// Importing this file MUST NOT open a TCP port — .listen() lives in server.ts.
// Topic 04 keeps the Topic 03 factory and health router untouched and only
// mounts one more router per resource.

import express from 'express';
import type { Application } from 'express';

import { articlesRouter } from './routes/articles.js';
import { healthRouter } from './routes/health.js';

export function createApp(): Application {
  const app = express();

  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/v1/articles', articlesRouter);

  return app;
}
