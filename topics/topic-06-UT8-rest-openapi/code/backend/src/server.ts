// Entry point: load env → create app → open TCP port.
// config/env.js is imported first: evaluating it runs process.loadEnvFile(),
// so a missing .env kills the process before the Express app is constructed.

import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
