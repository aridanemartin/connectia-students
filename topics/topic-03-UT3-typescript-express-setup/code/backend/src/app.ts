// createApp() returns a configured Express application.
// Importing this file MUST NOT open a TCP port — .listen() lives in server.ts.
// The factory shape (rather than a top-level const) makes future HTTP tests
// (Topic 05+) easy without forcing the abstraction now.

import express from 'express';
import type { Application } from 'express';

import { healthRouter } from './routes/health.js';

export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use('/health', healthRouter);

  return app;
}
