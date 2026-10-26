# Actividad 02 — Primeras rutas: lista y creación

## Objetivo

Definir tus dos primeras rutas sobre la app de Express: una de lectura y una de
creación, con un array en memoria.

> **Dónde trabajas**: en el **repositorio del backend** de tu equipo, en
> `src/app.ts` (o en un fichero de rutas sencillo).

## Apuntes: `app.get` y `app.post`

```ts
import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();
app.use(express.json()); // imprescindible para leer req.body

const documents: Array<{ id: string; title: string }> = [{'id': '1', 'title': 'documento1'}, {'id': '2', 'title': 'documento2'}];

app.get('/api/v1/admin/documents', (_req, res) => {

  if (!documents) {
    return res.status(400).json({ error: 'NO_DOCUMENTS' });
  }

  res.json({ documents }); // Si no pones nada en el status, Express devuelve 200 por defecto
});

app.post('/api/v1/admin/documents', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'MISSING_TITLE' });
  }

  const document = { id: randomUUID(), title };
  documents.push(document);
  res.status(201).json({ document });
});
```

- `express.json()` convierte el cuerpo JSON en `req.body`.
- `POST` que **crea** responde `201`.
- Si falta el dato mínimo, respondemos `400` (comprobación a mano; la validación
  formal llega en el Topic 07).

## Ejercicio

1. Copia este código a tu backend y asegúrate de que `app.use(express.json())` está montado antes de las rutas.
2. Prueba las dos rutas con `bruno` y con `curl` también (Fíjate que una es un `GET` y la otra un `POST`):

   ```bash
   curl -sS http://localhost:3000/api/v1/admin/documents
   curl -i -X POST http://localhost:3000/api/v1/admin/documents \
     -H 'Content-Type: application/json' \
     -d '{"title":"Normas de convivencia"}'
   ```

## Preguntas
1. ¿Qué diferencia hay entre un `GET` y un `POST`?
2. ¿Cómo podríamos hacer que el GET devuelva un error cambiando el array `documents`?
3. Provoca un error en el POST y comprueba la respuesta. ¿Qué código de estado devuelve?
4. ¿Por qué el GET devuelve un 200 y el POST un 201? ¿Qué significan esos códigos de estado?
5. ¿Qué pasa si hacemos un POST y el servidor se apaga?
