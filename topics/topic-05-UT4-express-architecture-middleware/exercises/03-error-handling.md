# Actividad 3: Manejadores de error 404 y 500

**Objetivo**: Implementar y verificar los manejadores de error centralizados.

> **Dónde trabajas**: en el **repositorio del backend** de tu equipo — el
> repositorio aparte donde construyes el proyecto Node.js + Express, no el
> repositorio de documentación. Los ficheros nuevos se añaden bajo su `src/`
> (`src/middlewares/`, `src/errors/`).

> **En tu repositorio del backend**: añade `src/errors/AppError.ts`,
> `src/middlewares/notFound.ts` y `src/middlewares/errorHandler.ts` y
> regístralos en `src/app.ts` en el orden correcto.
>
> **Avance de vuestra API**: todas las rutas de documents/questions
> responderán sus errores con este contrato único.

## Apuntes: el modelo de errores de Express en tres piezas

Hay **tres piezas complementarias** que funcionan juntas. Entender cada una
evita el error típico de "el error no llega nunca al manejador".

### 1. `AppError` — el error con forma (`src/errors/AppError.ts`)

Un error de JavaScript solo tiene `message` y `stack`. `AppError` añade dos
campos que HTTP necesita: un `statusCode` (400, 404…) y un `code`
(`BAD_REQUEST`, `NOT_FOUND`…). Se lanza como cualquier error:

```typescript
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### 2. `notFound` — el 404 (`src/middlewares/notFound.ts`)

Se registra **después de todas las rutas**. Solo se ejecuta si ninguna ruta
respondió antes (si alguna hubiera respondido, no se habría llamado a
`next()` hasta aquí):

```typescript
export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.path}`,
  });
}
```

Observa que **no tiene `next` ni `err`**: su trabajo es responder, no ceder.

### 3. `errorHandler` — el 500 (y todos los errores) (`src/middlewares/errorHandler.ts`)

Es el **último** middleware registrado y el único con **cuatro parámetros**:
`(err, req, res, next)`. Express lo identifica por esa firma y le entrega
cualquier error que un middleware anterior propague con `next(err)`:

```typescript
import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const isProduction = env.NODE_ENV === 'production';

  console.error(
    JSON.stringify({
      requestId: req.requestId,
      error: err.message,
      stack: isProduction ? undefined : err.stack,
    }),
  );

  // Errores esperados: los lanza nuestro código a propósito (400, 404...).
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.code ?? 'ERROR', message: err.message });
    return;
  }

  // express.json() lanza un SyntaxError si el body no es JSON válido:
  // es culpa del cliente, así que es un 400, no un 500.
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'INVALID_JSON', message: 'Request body is not valid JSON' });
    return;
  }

  // Cualquier otra cosa es inesperada: 500, sin detalles internos en producción.
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: isProduction ? 'An unexpected error occurred' : err.message,
  });
}
```

Lógica del status: si el error es un `AppError`, usa su `statusCode` y su
`code` (lanzado con 400 → responde 400); si es el JSON roto de
`express.json()`, responde 400 `INVALID_JSON`; si es cualquier otro error,
responde 500 `INTERNAL_ERROR`. En `production` no se filtra el `stack` ni el
mensaje interno al cliente (aunque el log del servidor sí los guarda).

> **¿Por qué `_next` si no se usa?** Porque sin él la función tendría **tres**
> parámetros y Express la trataría como un middleware normal: los errores
> pasarían de largo y el cliente recibiría la página HTML de error por
> defecto de Express. El `_` y el comentario `eslint-disable-next-line` le
> dicen al linter que no lo usamos a propósito.

> `req.requestId` lo añade el middleware de la Actividad 4. Hasta entonces
> TypeScript se quejará de esa línea: puedes quitar `requestId` del log y
> volver a ponerlo en la Actividad 4.

### El encadenado completo

```
cualquier handler ──lanzar AppError──►  next(err)  ──►  errorHandler
                                                 (salta directo, se
                                                  saltan middlewares)
ninguna ruta responde ──────────────────────►  notFound (404)
```

## Instrucciones

1. Añade un manejador de rutas no encontradas (404) en `src/middlewares/notFound.ts`
2. Añade un manejador centralizado de errores (500) en `src/middlewares/errorHandler.ts`
3. Añade una clase `AppError` en `src/errors/AppError.ts` (si no la creaste ya en la Actividad 2)
4. Registra ambos manejadores en el `createApp()` de `app.ts`, **después** de todos los routers y en este orden: `notFound` y luego `errorHandler`
5. Comprueba que tus controladores (`documentsController`, `questionsController`) lanzan `AppError` en lugar de responder directamente con error

## Verificación

Ejecuta estos comandos curl y captura la salida:

```bash
# 404 — ruta no encontrada
curl -i http://localhost:3000/nonexistent

# 400 — petición inválida (body vacío)
curl -i -X POST http://localhost:3000/api/v1/admin/documents \
  -H "Content-Type: application/json" \
  -d '{}'

# 400 — el body no es JSON válido
curl -i -X POST http://localhost:3000/api/v1/admin/documents \
  -H "Content-Type: application/json" \
  -d '{malo'

# 404 — documento que no existe
curl -i http://localhost:3000/api/v1/admin/documents/no-existe

# 500 — error interno (si tu app tiene una ruta que lance error)
# o fuerza un error temporalmente
```

> **Cómo forzar el 500 para la captura**: vamos a simular un error del servidor incluyendo en cualquier ruta `GET` o `POST` un `throw new Error('boom')`, captura la respuesta y revierte el cambio después.
