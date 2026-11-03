# Topic 05 — Express Architecture and Middleware

## Lo que asumimos de los Topics 03–04

Antes de empezar este topic, deberías tener:

- Un proyecto Node.js + TypeScript + Express en la raíz del repositorio de tu equipo
- `tsconfig.json` con `"strict": true`
- Scripts `dev`, `build`, `start`, `typecheck`, `lint`, `format`, `format:check` en `package.json`
- Configuración por variables de entorno: `.env` cargado de forma nativa
  (`process.loadEnvFile()`) y centralizado en `src/config/env.ts` con
  valores por defecto (la validación fail-fast con `zod` llega en el Topic 07)
- Separación app/server (`app.ts` exporta `createApp()`, `server.ts` escucha)
- `GET /health/live` respondiendo `{"status":"live"}` (`src/routes/health.ts`)
- ESLint y Prettier configurados
- Los cinco endpoints de Connectia funcionando en memoria (Topic 04), cada
  recurso en su router: `src/routes/documents.ts` y `src/routes/questions.ts`,
  con la lógica escrita dentro de cada ruta

## Objetivos de aprendizaje

Al completar este topic, serás capaz de:

1. Explicar el ciclo de vida de una petición en Express (middleware → ruta → respuesta)
2. Mantener las rutas en routers modulares (`express.Router()`) que solo
   conectan URL → controlador
3. Implementar middleware personalizado (requestId, logger)
4. Separar el código en rutas, controladores y servicios
5. Implementar un manejador de rutas no encontradas (404)
6. Implementar un manejador centralizado de errores (500)
7. Añadir identificadores únicos por petición y logging estructurado
8. Verificar manualmente los caminos de error (400, 404, 500)

## Conceptos nuevos

### Express Router (repaso)

`express.Router()` ya lo conocéis: es el mini enrutador que agrupa las rutas de
un recurso. Lo usasteis para `healthRouter` en el Topic 03 y para
`documentsRouter` y `questionsRouter` en el Topic 04:

```typescript
// src/app.ts, dentro de createApp()
app.use('/health', healthRouter);
app.use('/api/v1/admin/documents', documentsRouter);
app.use('/api/v1/questions', questionsRouter);
```

Lo que cambia en este topic es **qué hay dentro** del router. En el Topic 04
cada ruta tenía toda la lógica escrita dentro; ahora el router solo dice qué
función del controlador atiende cada URL:

```typescript
// src/routes/articles.ts (proyecto de referencia)
articlesRouter.get('/', articlesController.list);
articlesRouter.post('/', articlesController.create);
```

Ventajas de Router frente a definir rutas directamente en `app`:
- Las rutas quedan organizadas por recurso (cada fichero = un conjunto de rutas relacionadas)
- Se puede cambiar el prefijo sin modificar las rutas internas
- Cada Router puede tener su propio middleware

### Middleware

Una función middleware tiene esta firma:

```typescript
function miMiddleware(req: Request, res: Response, next: NextFunction): void {
  // hacer algo
  next(); // pasar al siguiente middleware
}
```

El middleware se ejecuta en el orden en que se registra con `app.use()`:

1. `app.use(requestId)` — asigna un UUID a cada petición (el primero, para que todos los demás lo vean)
2. `app.use(logger)` — registra la petición en los logs
3. `app.use(express.json())` — analiza el body JSON
4. `app.use('/health', healthRouter)`, `app.use('/api/v1/articles', articlesRouter)`… — las rutas se ejecutan aquí
5. `app.use(notFound)` — captura rutas no encontradas
6. `app.use(errorHandler)` — captura errores (4 parámetros)

**Importante**: si el errorHandler se registra antes que las rutas, no capturará errores de las rutas.

### Ciclo de vida de una petición

```
Petición HTTP → requestId → logger → express.json() → ruta → respuesta
                                                          ↓ (si no coincide)
                                                    notFound (404)
                                                          ↓ (si error)
                                                  errorHandler (500)
```

Cada middleware puede:
- Pasar la petición al siguiente con `next()`
- Enviar una respuesta con `res.json()`, `res.send()`, etc.
- Pasar un error con `next(err)`

Si un middleware no hace ninguna de estas tres cosas, la petición se queda colgada hasta timeout.

### Separación rutas → controladores → servicios

```
routes/       → define paths HTTP y métodos (GET, POST, etc.)
                 LLAMA a un controlador
controllers/  → recibe req/res, valida entrada, formatea respuesta
                 DELEGA en un servicio
services/     → lógica de negocio pura
                 NO importa Express, NO usa req/res/next
```

**Regla de oro**: un servicio nunca debe importar `express` ni usar `Request`, `Response` o `NextFunction`. Si lo hace, se ha colado lógica HTTP donde no toca.

### Manejador de rutas no encontradas (404)

Se registra DESPUÉS de todas las rutas:

```typescript
// notFound.ts
export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.path}`,
  });
}
```

Si una petición no coincide con ninguna ruta registrada, llega aquí.

### Manejador centralizado de errores (500)

Tiene CUATRO parámetros (Express lo identifica por la aridad):

```typescript
// errorHandler.ts
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // ... manejar el error
}
```

Debe registrarse el último. Cuando un middleware o ruta llama a `next(err)` o lanza una excepción, Express salta los middlewares normales y va directamente al errorHandler.

**Importante**: en `NODE_ENV=production` el errorHandler NO debe mostrar el stack trace al cliente.

### AppError

Una clase de error personalizada que asocia un código HTTP:

```typescript
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
  }
}
```

Uso: `throw new AppError(404, "Article with id '42' not found", 'NOT_FOUND')`.

### Identificador único por petición (requestId)

Se asigna con `crypto.randomUUID()` al principio de la cadena de middleware:

```typescript
export function requestId(req: Request, _res: Response, next: NextFunction): void {
  req.requestId = randomUUID();
  next();
}
```

**El requestId debe ser el primer middleware** para que todos los demás (logger, rutas, errorHandler) tengan acceso al identificador.

### Logging estructurado

En lugar de `console.log('mensaje')`, se registra un objeto JSON:

```json
{
  "requestId": "abc-123",
  "method": "GET",
  "path": "/api/v1/articles",
  "status": 200,
  "durationMs": 5,
  "timestamp": "2026-07-23T12:00:00.000Z"
}
```

El logger se suscribe al evento `finish` de la respuesta para capturar el código de estado y calcular la duración.

## Contrato de respuesta de error

Toda respuesta de error sigue este formato:

```json
{
  "error": "NOT_FOUND",
  "message": "Route not found: GET /nonexistent"
}
```

| Código | error | message |
|--------|-------|---------|
| 400 | `BAD_REQUEST` | `"Missing required field: title"` |
| 400 | `INVALID_JSON` | `"Request body is not valid JSON"` |
| 404 | `NOT_FOUND` | `"Route not found: GET /nonexistent"` |
| 404 | `NOT_FOUND` | `"Article with id '42' not found"` |
| 500 | `INTERNAL_ERROR` | `"An unexpected error occurred"` (producción) |
| 500 | `INTERNAL_ERROR` | Mensaje con stack trace (desarrollo) |

## Errores comunes y depuración

| Error | Causa | Solución |
|-------|-------|----------|
| El errorHandler no captura errores | Está registrado antes que las rutas | Mueve `app.use(errorHandler)` al final |
| `next()` no envía respuesta | `next()` solo pasa el control | Asegúrate de que cada ruta llama a `res.json()` o `next()` |
| `Error: ... is not a function` en errorHandler | El errorHandler tiene 3 parámetros en vez de 4 | Debe tener exactamente `(err, req, res, next)` |
| requestId es `undefined` en logger o errorHandler | requestId middleware no es el primero | Registra `requestId` antes que `logger` |
| El servicio importa `express` | Confusión de capas | Los servicios son TypeScript puro, sin Express |
| 404 en rutas que deberían funcionar | Router no montado o montado con prefijo incorrecto | Verifica los `app.use('/api/v1/...', router)` en app.ts |
| Los errores llegan como una página HTML | El errorHandler tiene 3 parámetros y Express no lo reconoce | Añade el cuarto parámetro (`_next: NextFunction`) |
| Un JSON mal escrito devuelve 500 | El errorHandler trata el `SyntaxError` de `express.json()` como error inesperado | Distingue ese caso y responde 400 `INVALID_JSON` |

## Actividades

Las actividades de este topic están en `exercises/`:

1. **01-middleware-order.md** — Dibuja el orden de ejecución del middleware
2. **02-route-controller-service.md** — Refactoriza código inline en tres capas
3. **03-error-handling.md** — Añade manejadores 404/500 y verifica con curl
4. **04-request-id-logging.md** — Añade requestId y logging estructurado

## Código de referencia

El proyecto de referencia completo está en `code/backend/`. Es el mismo
proyecto del Topic 04 con el recurso de práctica `articles` repartido en
rutas → controladores → servicios y los middlewares de este topic: la misma
arquitectura y las mismas carpetas que tendrá vuestro backend, pero sin
vuestros `documents` y `questions`, que son vuestro trabajo. Para ejecutarlo:

```bash
cd code/backend
cp .env.example .env
npm install
npm run dev
```

Comandos de verificación:

```bash
# Health check
curl http://localhost:3000/health/live

# Listar artículos
curl http://localhost:3000/api/v1/articles

# Crear artículo
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primer artículo"}'

# Obtener artículo por ID
curl http://localhost:3000/api/v1/articles/<id>

# Ruta no encontrada (404)
curl http://localhost:3000/nonexistent

# Petición inválida (400)
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Autoevaluación

Al final del topic, deberías poder responder:

- [ ] ¿Qué hace `express.Router()` y por qué es útil?
- [ ] ¿En qué orden se ejecuta el middleware? ¿Por qué es importante?
- [ ] ¿Cuál es la diferencia entre un controlador y un servicio?
- [ ] ¿Por qué los servicios no deben importar Express?
- [ ] ¿Cómo se registra un manejador de errores con 4 parámetros?
- [ ] ¿Qué ocurre si el errorHandler se registra antes que las rutas?
- [ ] ¿Cómo se asigna un requestId único a cada petición?
- [ ] ¿Qué formato tienen las respuestas de error?
- [ ] ¿Cómo se oculta el stack trace en producción?
- [ ] ¿Qué comando curl usarías para probar un 404?

## Mapeo DSW

| Resultado | Criterio | Evidencia |
|-----------|----------|-----------|
| RA5.CE-pending-1 | Pendiente de texto oficial | Proyecto con estructura rutas/controladores/servicios |
| RA5.CE-pending-2 | Pendiente de texto oficial | Middleware personalizado (requestId, logger, errorHandler) |
| RA5.CE-pending-3 | Pendiente de texto oficial | Verificación de errores 400, 404, 500 con curl |

*Nota: Los criterios oficiales de RA5 están pendientes de publicación. Esta tabla se actualizará cuando estén disponibles en `references/dsw-learning-outcomes.md`.*

## Notas de sesión para el profesorado

Guía operativa para impartir la Topic 05: distribución del tiempo,
preparación previa y guion de la demostración. La topic son 7 horas en
una única sesión de aula, con ~5 equipos de 3–4 personas; la evaluación se
asigna a RA5 (pendiente de criterios oficiales).

### Distribución de las 7 horas

| Actividad | Duración | Tipo |
|-----------|----------|------|
| Introducción teórica: Middleware y ciclo de vida | 45 min | Direct instruction |
| Demostración guiada: De ruta única a estructura completa | 45 min | Guided demonstration |
| Actividad 1: Diagrama de orden de middleware | 20 min | Supervised practice |
| Actividad 2: Refactorización a tres capas | 60 min | Supervised practice |
| Actividad 3: Manejadores de error 404/500 | 45 min | Supervised practice |
| Descanso | 15 min | — |
| Actividad 4: RequestId y logging estructurado | 45 min | Supervised practice |
| Proyecto: Integrar todas las actividades en el proyecto del equipo (documents y questions) | 90 min | Project work |
| Revisión y preguntas | 15 min | Review |
| Evaluación y recogida de evidencias | 20 min | Assessment |

**Total: 7 horas.**

### Preparación previa

- [ ] Verificar Node.js ≥ 20.19 en el equipo del profesor.
- [ ] Verificar que el proyecto de referencia compila
  (`npm install && npm run typecheck && npm run build`).
- [ ] Calentar el proyecto de demostración (tenerlo abierto en el editor).
- [ ] Preparar ejemplos de código "malo" para mostrar:
  - Middleware registrado en orden incorrecto.
  - Controlador con lógica de negocio inline.
  - ErrorHandler con 3 parámetros.
- [ ] Preparar comandos `curl` para la demo (404, 400, 500).
- [ ] Verificar que los equipos tienen la Topic 04 completada (los cinco
  endpoints en `routes/documents.ts` y `routes/questions.ts`, y
  `/health/live` respondiendo).
- [ ] Tener a mano el proyecto de referencia para comparación.

### Guión de demostración

1. **Punto de partida: el router del Topic 04** (10 min).
   1. Mostrar `src/app.ts` del Topic 04 — `createApp()` montando `/health` y
      `/api/v1/articles`.
   2. Abrir `src/routes/articles.ts` con toda la lógica dentro de cada ruta
      (como el `routes/documents.ts` de los equipos).
   3. Preguntar: ¿dónde está la lógica HTTP? ¿Y los datos? ¿Podría probar la
      creación de un artículo sin levantar un servidor?
   4. Comprobar con `curl http://localhost:3000/api/v1/articles` que funciona.

2. **Middleware personalizado** (10 min).
   1. Crear `src/middlewares/requestId.ts` — asignar UUID a cada petición.
   2. Crear `src/middlewares/logger.ts` — loguear método, path, status.
   3. Registrar en `app.ts` en el orden correcto.
   4. Mostrar logs con requestId al hacer `curl`.

3. **Orden de middleware** (10 min).
   1. Intercambiar el orden deliberadamente (errorHandler antes de rutas).
   2. Mostrar que no funciona.
   3. Restaurar el orden correcto y explicar por qué.
   4. Mostrar el diagrama de flujo.

4. **Separación en tres capas** (10 min).
   1. Partir del `routes/articles.ts` con todo inline en la ruta.
   2. Extraer controlador: `src/controllers/articlesController.ts`.
   3. Extraer servicio: `src/services/articlesService.ts`.
   4. Señalar que el servicio no importa Express y que el router queda en
      cuatro líneas.

5. **Manejo de errores** (5 min).
   1. Forzar 404 con `curl /nonexistent`.
   2. Forzar 400 con `curl -X POST ... -d '{}'` y con un JSON mal escrito
      (`-d '{malo'`).
   3. Forzar 500 en desarrollo (mostrar stack).
   4. Cambiar a `NODE_ENV=production` y mostrar que se oculta el stack.

### Conceptos erróneos esperados

- **"El middleware se ejecuta en orden alfabético"** — Respuesta: se
  ejecuta en el orden de `app.use()`.

- **"El errorHandler va antes de las rutas"** — Respuesta: debe ir
  después — es el último.

- **"Los servicios pueden importar Express"** — Respuesta: no; son
  TypeScript puro.

- **"`next()` envía una respuesta"** — Respuesta: `next()` solo pasa el
  control.

- **"El errorHandler necesita 3 parámetros"** — Respuesta: necesita 4:
  `(err, req, res, next)`.

- **"`throw` en una ruta asíncrona es capturado automáticamente"** —
  Respuesta: Express 5 lo captura, pero en Express 4 hay que llamar a
  `next(err)`.

- **"El requestId puede ir en cualquier orden"** — Respuesta: debe ser el
  primero de la cadena.

- **"En producción los errores se muestran igual"** — Respuesta: en
  producción se oculta el stack trace.

### Puntos de control

Antes de pasar a la siguiente actividad, verifica:

- [ ] ¿Los estudiantes entienden el orden de middleware?
- [ ] ¿Los estudiantes pueden explicar qué hace `next()`?
- [ ] ¿Los routers de `documents` y `questions` solo conectan URL →
  controlador?
- [ ] ¿Los estudiantes han separado al menos un controlador de su
  servicio?

Si algo falla, dedica 5 minutos extra a repasar con el equipo antes de
continuar.

### Diferenciación

- **Apoyo** para estudiantes con dificultades:
  - Proporcionar plantillas de ficheros vacíos con los imports necesarios.
  - Usar el proyecto de referencia como guía paso a paso.
  - Trabajar en parejas en lugar de individualmente.

- **Extensión** para estudiantes que terminan pronto:
  - Añadir un middleware de rate limiting simple.
  - Añadir un middleware de CORS.
  - Adelantar la validación de body con `zod` que se introduce en el Topic 07.
  - Añadir un endpoint `GET /api/v1/articles/error` que lance una excepción
    para probar el 500.

### Evidencias de evaluación (recogida por equipo)

- [ ] URL del repositorio del equipo.
- [ ] `exercises/01-middleware-order.md` — diagrama de orden de middleware.
- [ ] `exercises/03-error-handling.md` — salida de `curl` (404, 400, 500).
- [ ] `exercises/04-request-id-logging.md` — logs con requestId.
- [ ] Estructura del proyecto con `src/routes/`, `src/controllers/` y
  `src/services/` para `documents` y `questions`, y `GET /health/live`
  respondiendo.
- [ ] Servicios sin imports de Express (verificación visual).
- [ ] ErrorHandler con 4 parámetros (verificación visual).

### Preguntas anticipadas

- **¿Por qué no usar un solo fichero para todo?** Cuando el proyecto
  crezca a 20 rutas, un solo fichero será inmanejable. La separación en
  capas y módulos permite trabajar en equipo sin pisarse.
- **¿Qué pasa si me olvido de llamar a `next()`?** La petición se queda
  colgada hasta el timeout del servidor. Es un error común y fácil de
  depurar.
- **¿Por qué no usar una librería de logging como Winston?** Para el
  tamaño de este proyecto, `console.log` con JSON es suficiente. Añadir
  Winston ahora sería overengineering; si el proyecto creciera, se podría
  añadir más adelante.
- **¿El errorHandler captura errores de código asíncrono?** Express 5
  captura automáticamente los errores de promesas rechazadas. En Express 4
  habría que usar `express-async-errors` o envolver manualmente.