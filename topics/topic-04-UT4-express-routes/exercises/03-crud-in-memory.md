# Actividad 03 — CRUD en memoria: los cinco endpoints de Connectia

## Objetivo

Implementar los cinco endpoints del proyecto **de la forma más sencilla
posible**: lógica en la ruta y un array en memoria.

> **Dónde trabajas**: en el **repositorio del backend** de tu equipo. Sigues
> con `src/routes/documents.ts` (Actividad 02) y creas
> `src/routes/questions.ts`, que montas en `src/app.ts` igual que el de
> documentos. No crees controladores ni servicios todavía: eso es el
> Topic 05.

## Los cinco endpoints

| Método | Ruta | Qué hace | Éxito / Error |
|--------|------|----------|-------|
| `POST` | `/api/v1/questions` | Devuelve una respuesta simulada fija con citas | `200` / `400` |
| `GET` | `/api/v1/admin/documents` | Lista de documentos (en memoria), paginada con `?page=` y `?limit=` | `200` |
| `POST` | `/api/v1/admin/documents` | Crea metadatos de un documento | `201` / `400` |
| `GET` | `/api/v1/admin/documents/:documentId` | Consulta un documento | `200` / `404` |
| `PATCH` | `/api/v1/admin/documents/:documentId` | Modifica los campos enviados | `200` / `404` |

Al terminar, tu `src/app.ts` monta **tres** routers:

```ts
app.use('/health', healthRouter);
app.use('/api/v1/admin/documents', documentsRouter);
app.use('/api/v1/questions', questionsRouter);
```

## Apuntes: leer `params`

Dentro de `documentsRouter`, la ruta de un elemento es `'/:documentId'`
(recuerda: el prefijo `/api/v1/admin/documents` ya lo pone el `app.use`):

```ts
// GET /api/v1/admin/documents/:documentId
documentsRouter.get('/:documentId', (req, res) => {
  const { documentId } = req.params; // /documents/abc -> "abc"
  const document = documents.find((d) => d.id === documentId);

  if (!document) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }
  res.json({ data: document });
});
```

## Apuntes: leer `query` (paginar la lista)

Con muchos documentos no queremos devolverlos todos de golpe. El cliente pide
una **página** con la query: `GET /api/v1/admin/documents?page=2&limit=10`.
Cambia el `GET /` de la Actividad 02 por este:

```ts
// GET /api/v1/admin/documents?page=1&limit=20
documentsRouter.get('/', (req, res) => {
  // req.query SIEMPRE llega como texto: "2", no 2. Hay que convertirlo.
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const start = (page - 1) * limit;

  res.json({
    data: documents.slice(start, start + limit),
    pagination: { page, limit, total: documents.length },
  });
});
```

- Si no envían `page` o `limit`, usamos `1` y `20` (`??` pone el valor por
  defecto).
- `slice(start, start + limit)` recorta el trozo del array que toca.
- `pagination` le cuenta al cliente en qué página está y cuántos documentos
  hay en total.

## Apuntes: el mock de preguntas (sin IA)

Crea `src/routes/questions.ts`:

```ts
import { Router } from 'express';

export const questionsRouter = Router();

// POST /api/v1/questions
questionsRouter.post('/', (req, res) => {
  const { question } = req.body;

  if (typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'INVALID_QUESTION' });
  }

  res.json({
    data: {
      answer: 'Respuesta simulada: consulta la documentación pública del centro.',
      citations: [
        {
          documentId: '11111111-1111-4111-8111-111111111111',
          title: 'Guía pública del centro',
          excerpt: 'La información actualizada está disponible en los canales oficiales.',
        },
      ],
    },
  });
});
```

Y móntalo en `src/app.ts` con su `import` y
`app.use('/api/v1/questions', questionsRouter)`.

## Ejercicio

1. Implementa los **cinco** endpoints: paginación en la lista, consulta por
   `documentId`, el mock de preguntas y el `PATCH`.
2. El `PATCH` no tiene apunte: escríbelo tú. Busca el documento como en el
   `GET /:documentId` (y responde `404` si no existe); después cambia
   **solo** los campos que vengan en `req.body` (`title`, `description`) y
   responde `200` con `{ "data": documento }`.
3. Usa el verbo correcto en cada uno y devuelve JSON.
4. No añadas capas ni middleware propio: la lógica va en la ruta.
5. Comprueba que `GET /health/live` sigue respondiendo y pasa
   `npm run typecheck` y `npm run lint`.
