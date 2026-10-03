// GET /health/live — the only route in Topic 03.
// Response body is EXACTLY { "status": "live" } (spec Q3); no other fields.

import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/live', (_req, res) => {
  res.status(200).json({ status: 'live' });
});
