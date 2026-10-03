# Reference backend — Topic 03

This folder contains the runnable reference project the teacher demonstrates
in class. It is **not** a template to be filled in — teams reproduce it
step by step in the root of their own repository, following the
pedagogical [README](../README.md).

## Prerequisites

- Node.js ≥ 20 LTS (`node --version`)
- npm ≥ 10 (`npm --version`)

## Run it locally

```bash
cd topics/topic-03-UT3-typescript-express-setup/code/backend
npm install
npm run dev
```

The server starts on the port configured in `.env` (defaults to `3000`
if you copy `.env.example` to `.env`).

In another terminal:

```bash
curl -sS -i http://localhost:3000/health/live
```

Expected output:

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 17

{"status":"live"}
```

## Build and run compiled version

```bash
npm run build         # compiles src/ → dist/
npm start             # runs the compiled server: node dist/server.js
```

> **Build first.** `npm start` does **not** compile anything: it runs
> `dist/server.js` directly with Node. If you skip `npm run build`, `dist/`
> does not exist yet and Node fails with its native error
> `Error: Cannot find module '.../dist/server.js'` (code `MODULE_NOT_FOUND`).
> That error means exactly one thing here: you forgot the build.

## Reproduce the error demos

```bash
# missing .env (native loadEnvFile error)
rm .env
npm run dev            # → exit 1 with Error: ENOENT ... open '.env'

# real environment wins over .env
PORT=4321 npm run dev  # → Listening on http://localhost:4321

# missing dist/ (start never compiles — build first)
rm -rf dist
npm start              # → exit 1 with Error: Cannot find module '.../dist/server.js'
```

## Verify tooling

```bash
npm run typecheck      # TypeScript type-checks without emitting
npm run lint           # ESLint
npm run format:check   # Prettier (check only, no writes)
```

All four should exit zero on a clean checkout.
