import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';

const app = express();

if (!process.env.PORT) {
  console.error('Missing required environment variable: PORT.');
  console.error("Copy .env.example to .env (e.g. 'cp .env.example .env') and try again.");
  process.exit(1);
}

const PORT = Number(process.env.PORT);


app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/hello', (req: Request, res: Response) => {
  const rawName = req.query.name;
  const name = typeof rawName === 'string' && rawName.trim() !== '' ? rawName.trim() : 'mundo';
  res.status(200).json({ message: `Hola, ${name}!` });
});

const server = app.listen(PORT, () => {
  console.log(`Connectia Week 02 demo backend listening on http://localhost:${PORT}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    console.error('Stop the process using it, or change PORT in .env, and try again.');
    process.exit(1);
  }
  throw err;
});
