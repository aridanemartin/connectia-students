# Actividad 4: Identificador único y logging estructurado

**Objetivo**: Añadir requestId a cada petición y logging estructurado en formato JSON.

> **Dónde trabajas**: en el **repositorio del backend** de tu equipo — el
> repositorio aparte donde construyes el proyecto Node.js + Express, no el
> repositorio de documentación. Los middlewares se añaden bajo su `src/`
> (`src/middlewares/`).

> **En tu repositorio del backend**: añade `src/middlewares/requestId.ts` y
> `src/middlewares/logger.ts` y regístralos al principio del `createApp()` de
> `src/app.ts` (requestId el primero, antes incluso de `express.json()`).
>
> **Avance de vuestra API**: cada petición a documents/questions quedará
> identificada y logueada en JSON.

> Esta actividad convierte en middleware «de verdad» lo que probasteis a
> mano en la **Actividad 8 del Topic 03** (el `console.log(req.method,
> req.originalUrl)` en la ruta de health): los objetos `req` y `res` son
> los mismos que ya conocéis — aquí los observamos desde un middleware,
> correlacionados con un requestId y con formato JSON por línea.

## Apuntes: por qué un `requestId`

Cuando el backend recibe muchas peticiones (y sobre todo en producción), los
logs de distintas peticiones se mezclan en la misma salida. Sin un
identificador por petición es imposible responder a la pregunta *"¿qué le
pasó a la petición que entró a las 12:00:03?"*: tendrías que adivinar entre
líneas de log sin relación.

El **`requestId`** es un identificador único **generado al entrar la
petición** y adjunto a **todo** lo que esa petición genere (el log de
duración, el log de error…). Así se pueden correlacionar las entradas.

### ¿Por qué `requestId` debe ser el primer middleware?

Cada middleware posterior necesita `req.requestId` (el logger lo escribe, el
`errorHandler` lo registra). Si `requestId` no fuera el primero, habría
middleware ejecutándose **antes de que el identificador exista**. En el
proyecto de referencia el orden es: `requestId` → `logger` →
`express.json()`. El `logger` está **después** de `requestId` a propósito:
cuando el logger lea `req.requestId`, ya existe. Y `express.json()` va
**después** de los dos para que una petición con un JSON mal escrito (que
`express.json()` rechaza) también quede identificada y registrada.

### `crypto.randomUUID()` frente a un contador

- Un contador incremental (`1`, `2`, `3`…) es predecible y colisiona: dos
  peticiones simultáneas (o dos procesos, si algún día hay varios servidores)
  pueden generar el mismo número.
- `crypto.randomUUID()` genera un UUID v4 (128 bits aleatorios) con
  colisión prácticamente imposible y **sin estado compartido**: no hay un
  contador global que mantener. Es la opción estándar de Node (módulo
  `node:crypto`).

### ¿Por qué el logger se suscribe al evento `finish`?

El `status` final de la respuesta **no se conoce en el momento en que el
middleware se ejecuta**: la respuesta todavía no ha terminado. Express emite
un evento `finish` en el objeto `res` cuando la respuesta se ha enviado por
completo. Escuchándolo (con `res.on('finish', ...)`) el logger captura el
**status real** (200, 400, 404…) y la **duración** real de la petición. De esta manera podemos pedirle a express que nos avise cuando la petición ha terminado y capturar la información que necesitamos justo al final de la misma, incluyendo el status code y la duración de la petición.

## Instrucciones

1. Crea un middleware `requestId` en `src/middlewares/requestId.ts` que asigne un UUID a cada petición usando `crypto.randomUUID()`
2. Crea un middleware `logger` en `src/middlewares/logger.ts` que registre en JSON: método, path, status, duración, requestId
3. Registra ambos en `app.ts` — requestId debe ser el primero, seguido de logger y después `express.json()`
4. Añade requestId al log del errorHandler

## Apuntes: el requestId tipado

Para que `req.requestId` sea accesible con tipos en todo el proyecto, el
middleware declara la extensión del tipo global de Express:

```typescript
declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}
```

Sin eso, `req.requestId` daría un error de TypeScript en el logger y en el
`errorHandler`.

## Verificación

Ejecuta estas peticiones y captura la salida de logs del servidor:

```bash
# Haz al menos 3 peticiones
curl http://localhost:3000/health/live
curl http://localhost:3000/api/v1/admin/documents
curl http://localhost:3000/nonexistent
```

Cada una debe generar una línea de log como esta:

```json
{"requestId":"abc-123-...","method":"GET","path":"/health/live","status":200,"durationMs":3,"timestamp":"2026-07-23T12:00:00.000Z"}
```

## Preguntas

1. ¿Por qué requestId debe ser el primer middleware?
2. ¿Qué ventaja tiene usar `crypto.randomUUID()` frente a un contador incremental?
3. ¿Por qué el logger se suscribe al evento `finish` de la respuesta?

> La respuesta a cada pregunta está desarrollada en los **Apuntes** de esta
> misma página. Escribidlas con vuestras palabras en una línea cada una;
> el equipo debe poder defenderlas oralmente.
