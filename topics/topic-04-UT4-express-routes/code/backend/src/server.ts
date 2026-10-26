import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
