# Actividad 02 — Primeras rutas: lista y creación

## Objetivo

Definir tus dos primeras rutas de Connectia: una de lectura y una de creación,
con un array en memoria, **sin romper nada de lo que construiste en el
Topic 03**.

> **Dónde trabajas**: en el **repositorio del backend** de tu equipo. Creas
> un fichero nuevo, `src/routes/documents.ts`, y añades **una línea** a
> `src/app.ts` para montarlo. **No sustituyas** `src/app.ts`: la factoría
> `createApp()`, el `express.json()` y el router de health se quedan como
> están.

## Apuntes: un router por recurso (lo mismo que hicisteis con health)

En la Actividad 7 del Topic 03 separasteis la aplicación en tres piezas:

- `src/server.ts` llama a `createApp()` y abre el puerto;
- `src/app.ts` construye la aplicación dentro de `createApp()`;
- `src/routes/health.ts` agrupa las rutas de health en un `Router`, que
  `app.ts` monta con `app.use('/health', healthRouter)`.

Para los documentos hacemos **exactamente lo mismo**: un `Router` nuevo en su
propio fichero, montado bajo un prefijo. La ruta completa es siempre
**prefijo del `app.use` + path del router**:

| Montaje en `app.ts` | Ruta en el router | URL final |
|---------------------|-------------------|-----------|
| `app.use('/health', healthRouter)` | `healthRouter.get('/live', ...)` | `GET /health/live` |
| `app.use('/api/v1/admin/documents', documentsRouter)` | `documentsRouter.get('/', ...)` | `GET /api/v1/admin/documents` |
| `app.use('/api/v1/admin/documents', documentsRouter)` | `documentsRouter.post('/', ...)` | `POST /api/v1/admin/documents` |

> En este topic la lógica se escribe **dentro de cada ruta**, a propósito. Un
> router por recurso no es una "capa": solo agrupa las rutas de un mismo
> recurso. Repartir esa lógica en controladores y servicios es el Topic 05.

## Paso 1: crea `src/routes/documents.ts`

```ts
import { randomUUID } from 'node:crypto';
import { Router } from 'express';

interface Document {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export const documentsRouter = Router();

// Datos en memoria: se pierden cada vez que el servidor se reinicia.
const documents: Document[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Guía pública del centro',
    description: '',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Normas de convivencia',
    description: '',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
];

// GET /api/v1/admin/documents
documentsRouter.get('/', (_req, res) => {
  res.json({ data: documents }); // Si no pones status, Express devuelve 200
});

// POST /api/v1/admin/documents
documentsRouter.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'MISSING_TITLE' });
  }

  const document: Document = {
    id: randomUUID(),
    title,
    description: description ?? '',
    createdAt: new Date().toISOString(),
  };
  documents.push(document);
  res.status(201).json({ data: document });
});
```

- `express.json()` (ya montado en `app.ts` desde el Topic 03) convierte el
  cuerpo JSON en `req.body`.
- Las respuestas de éxito van dentro de `data`: `{ "data": [...] }` para una
  lista y `{ "data": { ... } }` para un elemento. Es la forma que usaremos en
  todo el proyecto.
- `POST` que **crea** responde `201`.
- Si falta el dato mínimo, respondemos `400` (comprobación a mano; la
  validación formal llega en el Topic 07).
- `randomUUID()` (de `node:crypto`) genera un identificador único para cada
  documento nuevo.

## Paso 2: móntalo en `src/app.ts`

Añade **dos líneas** a tu `app.ts` del Topic 03: el `import` y el `app.use`.
Todo lo demás se queda igual:

```ts
import express from 'express';
import type { Application } from 'express';

import { documentsRouter } from './routes/documents.js'; // ← NUEVO
import { healthRouter } from './routes/health.js';

export function createApp(): Application {
  const app = express();

  app.use(express.json()); // antes de las rutas: si no, req.body es undefined

  app.use('/health', healthRouter);
  app.use('/api/v1/admin/documents', documentsRouter); // ← NUEVO

  return app;
}
```

> Si en el Topic 03 añadisteis más rutas al router de health (`/ready`) o la
> ruta `/test/<equipo>`, déjalas: no estorban.

## Ejercicio

1. Crea `src/routes/documents.ts` y monta el router en `src/app.ts` como en
   los pasos anteriores.
2. Arranca con `npm run dev` y comprueba que **lo del Topic 03 sigue
   funcionando**:

   ```bash
   curl -sS http://localhost:3000/health/live
   ```

3. Prueba las dos rutas nuevas con `bruno` y con `curl` (fíjate en que una es
   un `GET` y la otra un `POST`):

   ```bash
   curl -sS http://localhost:3000/api/v1/admin/documents
   curl -i -X POST http://localhost:3000/api/v1/admin/documents \
     -H 'Content-Type: application/json' \
     -d '{"title":"Calendario escolar"}'
   ```

4. Pasa `npm run typecheck` y `npm run lint` antes de dar la actividad por
   terminada.

## Preguntas

1. ¿Qué diferencia hay entre un `GET` y un `POST`?
2. En `documents.ts` la ruta es `'/'`, pero la URL es
   `/api/v1/admin/documents`. ¿De dónde sale el resto de la URL?
3. Provoca un error en el POST y comprueba la respuesta. ¿Qué código de estado
   devuelve?
4. ¿Por qué el GET devuelve un 200 y el POST un 201? ¿Qué significan esos
   códigos de estado?
5. Crea un documento con POST, para el servidor y vuelve a arrancarlo. ¿Sigue
   apareciendo en el GET? ¿Por qué?
