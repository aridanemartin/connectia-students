// Loads the .env file natively (no dotenv) and exports the config the
// server needs. Node's process.loadEnvFile() throws if .env is missing,
// so a broken setup kills the process immediately (fail-fast without any
// library). Real environment variables take precedence over .env values.
// Topic 05 hardens this file by validating it with a zod schema.

process.loadEnvFile();

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};
