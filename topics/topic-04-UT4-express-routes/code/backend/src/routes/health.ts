// GET /health/live — created in Topic 03 and kept as-is in every later topic.
// Response body is EXACTLY { "status": "live" }; no other fields.

import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/live', (_req, res) => {
  res.status(200).json({ status: 'live' });
});
