# Topic 04 — Rutas y verbos HTTP

En el Topic 03 dejasteis un servidor Express mínimo con **una** ruta
(`GET /health/live`) y la separación `app.ts` / `server.ts`. Ahora, antes de
meteros con arquitectura por capas y middleware, aprendemos lo más importante
de una API: **cómo se definen rutas y qué significa cada verbo HTTP**.

Este topic es deliberadamente **llano**: cada recurso tiene su propio
`Router` (igual que el `healthRouter` del Topic 03) y la lógica se escribe
dentro de cada ruta. Nada de controladores, servicios ni middleware propio
todavía — eso llega en el Topic 05. La meta es que cada equipo tenga sus
**endpoints funcionando** (en memoria) cuanto antes, **sin tocar** lo que ya
funcionaba: `createApp()`, `server.ts` y `GET /health/live` se quedan como
estaban.

> **Idioma**: las explicaciones pedagógicas están en español. Los
> identificadores técnicos (`GET`, `req.params`, `app.post`, etc.) van en
> inglés.

## Objetivos de aprendizaje

Al finalizar este topic serás capaz de:

- Explicar qué hace cada **verbo HTTP** (`GET`, `POST`, `PUT`, `PATCH`,
  `DELETE`) y cuándo usar cada uno.
- Definir rutas en un `Router` por recurso (`router.get(...)`,
  `router.post(...)`, etc.) y montarlo en `createApp()` con `app.use(...)`.
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

Una ruta se define con el **método** y el **path**. Como en el Topic 03, las
rutas de un mismo recurso se agrupan en un `Router` que se monta bajo un
prefijo:

```ts
// src/routes/articles.ts
export const articlesRouter = Router();

articlesRouter.get('/', (req, res) => { /* ... */ });  // GET  /api/v1/articles
articlesRouter.post('/', (req, res) => { /* ... */ }); // POST /api/v1/articles

// src/app.ts, dentro de createApp()
app.use('/api/v1/articles', articlesRouter);
```

- El **path** nombra el recurso (sustantivo): `/questions`, `/documents`.
- El **método** aporta la acción: `GET` lee, `POST` crea, `PATCH` modifica.
- La URL final es **prefijo del `app.use` + path del router**, igual que
  `/health` + `/live` = `/health/live`.

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
articlesRouter.get('/:articleId', (req, res) => {
  const { articleId } = req.params; // path:  /articles/123
});

articlesRouter.get('/', (req, res) => {
  const { page } = req.query;       // query: ?page=1
});

articlesRouter.post('/', (req, res) => {
  const { title } = req.body;       // body JSON (necesita express.json())
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
propia ruta del router:

```ts
const articles: Article[] = [];

articlesRouter.get('/', (_req, res) => {
  res.json({ data: articles });
});

articlesRouter.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'MISSING_TITLE' });
  }

  const article = {
    id: randomUUID(),
    title,
    description: description ?? '',
    createdAt: new Date().toISOString(),
  };
  articles.push(article);
  res.status(201).json({ data: article });
});
```

Las respuestas de éxito van siempre dentro de `data` (`{ "data": [...] }` o
`{ "data": { ... } }`): es la forma que mantendremos en todo el proyecto.

Es lo más sencillo que funciona. **No es la versión final**: en el Topic 05
esta lógica se reparte en rutas, controladores y servicios; en el Topic 07 se
valida con `zod`; y más adelante se guarda en PostgreSQL.

> **Nota sobre validación**: aquí hacemos comprobaciones mínimas a mano
> (`if (!title)`) para no dejar pasar un `400` obvio. La validación formal con
> esquemas es el Topic 07.

## Ejemplo guiado

El profesorado construye en vivo, sobre el proyecto del Topic 03, un recurso
de práctica (`articles`, con la misma forma que un documento) con un array en
memoria. Los documentos y las preguntas de Connectia los construye cada equipo
en las actividades:

1. Crear `src/routes/articles.ts` con un `Router` vacío y montarlo en
   `createApp()` con `app.use('/api/v1/articles', articlesRouter)`, **junto**
   al router de health.
2. Definir `GET /` (lista) y `POST /` (crear con `req.body`).
3. Definir `GET /:articleId` (elemento con `req.params`) y `PATCH /:articleId`.
4. Paginar la lista con `?page=` y `?limit=` (`req.query`).
5. Probar con `curl -i` cada caso, señalar el estado de la respuesta y
   comprobar que `GET /health/live` sigue respondiendo.

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
(en memoria, sin capas), en `src/routes/documents.ts` y
`src/routes/questions.ts`, montados en `createApp()` junto al router de health
del Topic 03:

- `POST /api/v1/questions` — recibe una pregunta y devuelve una respuesta
  simulada fija.
- `GET /api/v1/admin/documents` — lista de documentos, paginada con `?page=`
  y `?limit=`.
- `POST /api/v1/admin/documents` — crea metadatos de un documento.
- `GET /api/v1/admin/documents/{documentId}` — consulta un documento.
- `PATCH /api/v1/admin/documents/{documentId}` — actualiza parte de un
  documento.

`GET /health/live` sigue respondiendo `{"status":"live"}`. No hay base de
datos, ni controladores/servicios, ni middleware propio, ni validación con
esquemas, ni IA. Todo eso llega después.

## Criterios de aceptación

- [ ] Las cinco rutas existen y responden JSON; las de éxito, dentro de
      `data`.
- [ ] `src/app.ts` sigue exportando `createApp()` y `GET /health/live` sigue
      respondiendo.
- [ ] Cada recurso tiene su router (`src/routes/documents.ts`,
      `src/routes/questions.ts`) montado con `app.use(...)`.
- [ ] `npm run typecheck` y `npm run lint` pasan.
- [ ] `GET` devuelve `200`; `POST` que crea devuelve `201`; un documento
      inexistente devuelve `404`.
- [ ] Se leen datos de `req.params`, `req.query` y `req.body` correctamente.
- [ ] El verbo correcto en cada ruta (no hay verbos en el path).
- [ ] Las cuatro actividades están entregadas con capturas de `curl`/Bruno.

## Errores comunes y depuración

- **`server.ts` no arranca: `has no exported member 'createApp'`** — se ha
  sustituido `app.ts` entero por rutas sueltas. Recupera la factoría del
  Topic 03 y añade solo el `import` y el `app.use(...)` del router nuevo.
- **`GET /health/live` da `404`** — al tocar `app.ts` se ha borrado
  `app.use('/health', healthRouter)`.
- **El prefijo aparece dos veces** — `app.use('/api/v1/admin/documents', ...)`
  más `documentsRouter.get('/api/v1/admin/documents', ...)` publica
  `/api/v1/admin/documents/api/v1/admin/documents`. Dentro del router, los
  paths son relativos: `'/'` y `'/:documentId'`.
- **`req.body` es `undefined`** — falta `app.use(express.json())` antes de los
  routers.
- **El verbo en el path** (`/getDocuments`) — usa el método HTTP y un path de
  sustantivo: `GET /documents`.
- **Comparar `req.params.documentId` con un número** — los parámetros llegan
  como texto; compara como texto o convierte.
- **`?page=2` no pagina bien** — `req.query.page` es `"2"` (texto); conviértelo
  con `Number(...)` antes de operar.
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
- ¿Puedo definir rutas en un router (`router.get(...)`, `router.post(...)`) y montarlo en `createApp()`?
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
- cada recurso tiene su `Router` (como el de health del Topic 03) y la lógica
  se escribe **en la ruta**, a propósito;
- `createApp()`, `server.ts` y `GET /health/live` no se tocan: solo se añaden
  routers;
- solo hay comprobaciones mínimas a mano; la validación formal es el Topic 07;
- no hay persistencia, autenticación, subida de ficheros ni IA.

### Distribución de las 7 horas

| Bloque | Tiempo | Descripción |
|--------|--------|-------------|
| Instrucción directa | 1 h | Verbos HTTP, ruta = método + path, `params`/`query`/`body`, códigos de estado |
| Demostración guiada | 1 h | Construcción en vivo del CRUD en memoria de `articles` sobre el proyecto del Topic 03 |
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
2. **Un router nuevo** (~10 min): abrir `app.ts` y `routes/health.ts` del
   Topic 03, crear `routes/articles.ts` y montarlo **al lado** del health.
   Remarcar que la factoría no se toca.
3. **Lista y creación** (~20 min): `GET /` y `POST /` con un array en memoria.
4. **Elemento, edición y query** (~20 min): `GET /:articleId` con
   `req.params`, `PATCH` con `req.body` y paginación con `req.query`.
5. **Estados** (~10 min): `200`, `201`, `404` con `curl -i`; terminar con
   `curl /health/live`.
6. **Cierre** (~5 min): "esto es lo más simple; repartirlo en capas es el
   Topic 05".

### Conceptos erróneos esperados

- «El verbo va en la URL» — no: el verbo es el método HTTP.
- «`req.body` siempre está» — solo si `express.json()` está montado.
- «`req.params` ya es número» — llega como texto.
- «Hay que crear controladores ya» — no en este topic; primero que funcione.
- «Para añadir rutas hay que reescribir `app.ts`» — no: se crea un router
  nuevo y se añade una línea `app.use(...)` dentro de `createApp()`.
- «Un router por recurso ya es una capa» — no: solo agrupa rutas; la lógica
  sigue dentro de cada ruta hasta el Topic 05.

### Evidencias de evaluación (recogida por equipo)

- [ ] `01-http-verbs.md` con la tabla caso de uso → método → ruta.
- [ ] `02-first-routes.md` con `GET`/`POST` funcionando.
- [ ] `03-crud-in-memory.md` con los cinco endpoints implementados.
- [ ] `04-test-with-curl-bruno.md` con capturas de `200`, `201`, `404`.

Consultar [`syllabus/README.md`](./syllabus/README.md).
