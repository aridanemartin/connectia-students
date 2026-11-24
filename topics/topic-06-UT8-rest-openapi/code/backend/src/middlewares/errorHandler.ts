import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';

// Express recognises an error handler because it has FOUR parameters.
// `_next` is never used, but it must be there: with three parameters Express
// would treat this function as a normal middleware and never hand it errors.
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const isProduction = env.NODE_ENV === 'production';

  console.error(
    JSON.stringify({
      requestId: req.requestId,
      error: err.message,
      stack: isProduction ? undefined : err.stack,
    }),
  );

  // Expected errors: thrown on purpose by our code (400, 404...).
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.code ?? 'ERROR', message: err.message });
    return;
  }

  // express.json() throws a SyntaxError when the body is not valid JSON.
  // It is the client's fault, so it is a 400, not a 500.
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'INVALID_JSON', message: 'Request body is not valid JSON' });
    return;
  }

  // Anything else is unexpected: 500, without internal details in production.
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: isProduction ? 'An unexpected error occurred' : err.message,
  });
}
