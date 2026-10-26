# Topic 04 — Rutas y verbos HTTP

En el Topic 03 dejasteis un servidor Express mínimo con **una** ruta
(`GET /health/live`) y la separación `app.ts` / `server.ts`. Ahora, antes de
meteros con arquitectura por capas y middleware, aprendemos lo más importante
de una API: **cómo se definen rutas y qué significa cada verbo HTTP**.

Este topic es deliberadamente **llano**: añadimos rutas directamente sobre la
app, con la lógica escrita ahí mismo. Nada de controladores, servicios ni
middleware todavía — eso llega en el Topic 05. La meta es que cada equipo tenga
sus **endpoints funcionando** (en memoria) cuanto antes.

> **Idioma**: las explicaciones pedagógicas están en español. Los
> identificadores técnicos (`GET`, `req.params`, `app.post`, etc.) van en
> inglés.

## Objetivos de aprendizaje

Al finalizar este topic serás capaz de:

- Explicar qué hace cada **verbo HTTP** (`GET`, `POST`, `PUT`, `PATCH`,
  `DELETE`) y cuándo usar cada uno.
- Definir rutas en Express con `app.get(...)`, `app.post(...)`, etc.
- Leer datos de la petición: `req.params` (path), `req.query` (query) y
  `req.body` (cuerpo JSON).
- Construir respuestas con el código de estado correcto (`res.status(...)`).
- Implementar los endpoints de Connectia **de la forma más sencilla posible**,
  con un array en memoria.
- Probarlos con `curl`/Bruno y comprobar el estado y el cuerpo.

## Prerrequisitos

- **Topic 03**: proyecto Node.js + TypeScript + Express, separación
  `app.ts` / `server.ts`, `GET /health/live` respondiendo y `express.json()`
  montado.

## Conceptos del topic

### Ruta = método + path

Una ruta se define con el **método** y el **path**:

```ts
app.get('/api/v1/questions', (req, res) => { /* ... */ });
app.post('/api/v1/questions', (req, res) => { /* ... */ });
```

- El **path** nombra el recurso (sustantivo): `/questions`, `/documents`.
- El **método** aporta la acción: `GET` lee, `POST` crea, `PATCH` modifica.

### Verbos HTTP

| Verbo | Para qué | ¿Crea/cambia algo? | Éxito típico |
|-------|----------|--------------------|--------------|
| `GET` | Leer una lista o un elemento | No | `200` |
| `POST` | Crear un recurso (o procesar algo) | Sí (o produce un resultado) | `201` (crear) / `200` (procesar) |
| `PUT` | Reemplazar un recurso entero | Sí | `200` |
| `PATCH` | Modificar **parte** de un recurso | Sí | `200` |
| `DELETE` | Eliminar un recurso | Sí | `204` |

Regla: **el verbo va en el método, nunca en el path**. `/createDocument` está
mal; `POST /documents` está bien.

### De dónde salen los datos

```ts
app.get('/api/v1/documents/:documentId', (req, res) => {
  const { documentId } = req.params; // path:  /documents/123
});

app.get('/api/v1/documents', (req, res) => {
  const { page } = req.query;        // query: ?page=1
});

app.post('/api/v1/documents', (req, res) => {
  const { title } = req.body;        // body JSON (necesita express.json())
});
```

> **Importante**: `req.params` y `req.query` **siempre son texto**. Si esperas
> un número, conviértelo (`Number(req.query.page)`).

### El código de estado lo eliges tú

```ts
res.status(201).json({ document }); // creado
res.status(404).json({ error: 'NOT_FOUND' }); // no encontrado
```

Si no llamas a `res.status(...)`, Express responde `200` por defecto.

### Implementación simple (la de este topic)

Guardamos los datos en un array **en memoria** y escribimos la lógica en la
propia ruta:

```ts
const documents: Array<{ id: string; title: string }> = [];

app.get('/api/v1/documents', (_req, res) => {
  res.json({ documents });
});

app.post('/api/v1/documents', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'MISSING_TITLE' });
  }

  const document = { id: crypto.randomUUID(), title };
  documents.push(document);
  res.status(201).json({ document });
});
```

Es lo más sencillo que funciona. **No es la versión final**: en el Topic 05
esta lógica se reparte en rutas, controladores y servicios; en el Topic 07 se
valida con `zod`; y más adelante se guarda en PostgreSQL.

> **Nota sobre validación**: aquí hacemos comprobaciones mínimas a mano
> (`if (!title)`) para no dejar pasar un `400` obvio. La validación formal con
> esquemas es el Topic 07.

## Ejemplo guiado

El profesorado construye en vivo, sobre el proyecto del Topic 03, un recurso
completo con un array en memoria:

1. Añadir `express.json()` si no está.
2. Definir `GET /api/v1/documents` (lista).
3. Definir `POST /api/v1/documents` (crear con `req.body`).
4. Definir `GET /api/v1/documents/:documentId` (elemento con `req.params`).
5. Probar con `curl -i` cada caso y señalar el estado de la respuesta.

El proyecto de referencia está en [`code/backend/`](./code/backend/); consulta
[`code/README.md`](./code/README.md) para ejecutarlo.

## Actividades del alumnado

Las actividades viven en [`./exercises/`](./exercises/). Se completan en orden.

| # | Actividad | Plantilla |
|---|-----------|-----------|
| 1 | Verbos HTTP: elige el método correcto | [`01-http-verbs.md`](./exercises/01-http-verbs.md) |
| 2 | Primeras rutas: lista y creación | [`02-first-routes.md`](./exercises/02-first-routes.md) |
| 3 | CRUD en memoria (los 5 endpoints de Connectia) | [`03-crud-in-memory.md`](./exercises/03-crud-in-memory.md) |
| 4 | Probar con `curl` y Bruno | [`04-test-with-curl-bruno.md`](./exercises/04-test-with-curl-bruno.md) |

## Incremento del topic en el proyecto

Al final del topic, el backend de cada equipo implementa **de forma sencilla**
(en memoria, sin capas):

- `POST /api/v1/questions` — recibe una pregunta y devuelve una respuesta
  simulada fija.
- `GET /api/v1/admin/documents` — lista de documentos.
- `POST /api/v1/admin/documents` — crea metadatos de un documento.
- `GET /api/v1/admin/documents/{documentId}` — consulta un documento.
- `PATCH /api/v1/admin/documents/{documentId}` — actualiza parte de un
  documento.

No hay base de datos, ni controladores/servicios, ni middleware propio, ni
validación con esquemas, ni IA. Todo eso llega después.

## Criterios de aceptación

- [ ] Las cinco rutas existen y responden JSON.
- [ ] `GET` devuelve `200`; `POST` que crea devuelve `201`; un documento
      inexistente devuelve `404`.
- [ ] Se leen datos de `req.params`, `req.query` y `req.body` correctamente.
- [ ] El verbo correcto en cada ruta (no hay verbos en el path).
- [ ] Las cuatro actividades están entregadas con capturas de `curl`/Bruno.

## Errores comunes y depuración

- **`req.body` es `undefined`** — falta `app.use(express.json())` antes de las
  rutas.
- **El verbo en el path** (`/getDocuments`) — usa el método HTTP y un path de
  sustantivo: `GET /documents`.
- **Comparar `req.params.id` con un número** — los parámetros llegan como
  texto; compara como texto o convierte.
- **Olvidar `return` tras responder** — si respondes y sigues ejecutando,
  puedes intentar responder dos veces (`Cannot set headers after they are
  sent`).
- **Ruta de elemento antes que la de colección** — declara las rutas
  específicas cuando corresponda; Express resuelve en orden.

## Resultados de aprendizaje DSW

> ⚠️ Los identificadores siguen el patrón `RAX.CE-pending-N` mientras
> `references/dsw-learning-outcomes.md` no tenga el texto oficial.

| RA | Criterio de evaluación | Evidencia este topic |
|----|------------------------|----------------------|
| RA2 | `RA2.CE-pending-1` — *pendiente texto oficial* | Rutas de Express con el verbo HTTP correcto (Actividades 1–2). |
| RA3 | `RA3.CE-pending-1` — *pendiente texto oficial* | Endpoints en memoria leyendo `params`, `query` y `body` (Actividades 2–4). |

## Autoevaluación

Responde **sí / con dudas / no**:

- ¿Puedo explicar para qué sirve cada verbo HTTP?
- ¿Puedo definir una ruta con `app.get(...)` y `app.post(...)`?
- ¿Puedo leer `req.params`, `req.query` y `req.body`?
- ¿Puedo elegir el código de estado correcto (`200`, `201`, `400`, `404`)?
- ¿Puedo implementar un CRUD en memoria sin ayuda?

## Notas de sesión para el profesorado

Guía operativa para impartir el Topic 04. El material para el alumnado está en
las secciones anteriores; los apuntes pedagógicos de cada actividad viven en
sus plantillas de [`exercises/`](./exercises/).

### Propósito y límites

Este topic existe para que el alumnado **añada rutas cuanto antes**, con la
implementación más simple posible. No se explica arquitectura ni middleware:
eso es el Topic 05. Límites que deben repetirse:

- los datos viven en un array en memoria (se pierden al reiniciar);
- la lógica se escribe **en la ruta**, a propósito;
- solo hay comprobaciones mínimas a mano; la validación formal es el Topic 07;
- no hay persistencia, autenticación, subida de ficheros ni IA.

### Distribución de las 7 horas

| Bloque | Tiempo | Descripción |
|--------|--------|-------------|
| Instrucción directa | 1 h | Verbos HTTP, ruta = método + path, `params`/`query`/`body`, códigos de estado |
| Demostración guiada | 1 h | Construcción en vivo del CRUD en memoria sobre el proyecto del Topic 03 |
| Práctica supervisada | 2 h | Actividades 1–3 con guía activa |
| Trabajo de proyecto | 2 h | Implementar los cinco endpoints de Connectia en el backend del equipo |
| Revisión | 0,5 h | Revisión cruzada de rutas y de códigos de estado |
| Evaluación | 0,5 h | Comprobación con `curl`/Bruno y recogida de evidencias |

**Total: 7 horas.**

### Preparación previa

- [ ] Comprobar que cada equipo trae el Topic 03 completado.
- [ ] `cd code/backend && npm install && npm run dev`.
- [ ] Tener preparados comandos `curl` para `200`, `201` y `404`.
- [ ] Recordar que `express.json()` es obligatorio para leer `req.body`.

### Guión de demostración

1. **Verbo + path** (~15 min): convertir casos de uso en método + ruta; anotar
   una mala práctica (`/getDocuments`).
2. **Lista y creación** (~20 min): `GET` y `POST` con un array en memoria.
3. **Elemento y edición** (~20 min): `GET /:id` con `req.params` y `PATCH` con
   `req.body`.
4. **Estados** (~10 min): `200`, `201`, `404` con `curl -i`.
5. **Cierre** (~5 min): "esto es lo más simple; repartirlo en capas es el
   Topic 05".

### Conceptos erróneos esperados

- «El verbo va en la URL» — no: el verbo es el método HTTP.
- «`req.body` siempre está» — solo si `express.json()` está montado.
- «`req.params` ya es número» — llega como texto.
- «Hay que crear controladores ya» — no en este topic; primero que funcione.

### Evidencias de evaluación (recogida por equipo)

- [ ] `01-http-verbs.md` con la tabla caso de uso → método → ruta.
- [ ] `02-first-routes.md` con `GET`/`POST` funcionando.
- [ ] `03-crud-in-memory.md` con los cinco endpoints implementados.
- [ ] `04-test-with-curl-bruno.md` con capturas de `200`, `201`, `404`.

Consultar [`syllabus/README.md`](./syllabus/README.md).
