# App vs. Server — Actividad 7

## Qué se hace en esta actividad

Nada nuevo se crea: se **refactoriza**. Desde la Actividad 1 el servidor
vive en un único `src/server.ts` que carga la config, define la ruta y
escucha (la Actividad 4 extrajo la configuración a `config/env.ts`). Esta
actividad parte ese fichero en tres responsabilidades — construir la
aplicación, agrupar rutas y arrancar la red — y deja cada una en su sitio.
El comportamiento observable no cambia ni una línea: `curl /health/live`
debe seguir respondiendo exactamente lo mismo.

> **En tu repositorio del backend**: refactoriza a `src/app.ts` (sin
> `.listen()`), `src/routes/health.ts` y `src/server.ts`.
>
> **Avance de vuestra API**: es la estructura que alojará los routers de
> documents/questions y permitirá testear la API sin abrir puertos.

## Estructura de ficheros que debes tocar en esta actividad

Crea **dos ficheros nuevos** (`src/app.ts`, `src/routes/health.ts`) y
**reescribe** `src/server.ts` dejándolo mínimo. Al terminar, el proyecto
coincide con el de referencia (`code/backend/`):

```
./   (raíz del repositorio del backend — proyecto completo)
├── package.json        # A1-A6: sin cambios en esta actividad
├── tsconfig.json       # A3: sin cambios
├── eslint.config.js    # A5: sin cambios
├── .prettierrc.json    # A6: sin cambios
├── .prettierignore     # A6: sin cambios
├── .gitignore          # A2: sin cambios
├── .env.example        # A2: sin cambios
└── src/
    ├── app.ts          # A7: NUEVO — createApp() devuelve la app SIN .listen()
    ├── server.ts       # A7: REESCRITO — solo importa y escucha
    ├── config/
    │   └── env.ts      # A4: sin cambios
    └── routes/
        └── health.ts   # A7: NUEVO — GET /live → { status: "live" } (montado en /health)
```

## Apuntes: por qué separar la "aplicación" del "servidor"

En Express hay **dos responsabilidades distintas** que el topic os pide
separar en dos ficheros:

1. **Construir la aplicación** (`app.ts`): configurar Express — middlewares,
   rutas, parseo de JSON — y devolver un objeto `app` listo para usarse.
   Aquí **no** se abre ningún puerto.
2. **Arrancar el servidor de red** (`server.ts`): importar la app, llamar a
   `.listen()` y abrir un puerto TCP real.

La separación existe por una razón concreta y comprobable: **la
testabilidad**. Cuando en topics futuros escribamos tests HTTP,
importaremos `app.ts` en el test y lo ejercitaremos **sin abrir ningún
puerto real**. Si `app.ts` llamara a
`.listen()`, cada import abriría un puerto y los tests serían frágiles,
lentos y difíciles de aislar. La regla práctica:

> **Importar `app.ts` nunca debe abrir un puerto. Solo `server.ts` llama a
> `.listen()`.**

## Apuntes: el código de referencia, línea a línea

### `src/app.ts` — la factoría `createApp()`

```ts
import express from 'express';
import type { Application } from 'express';
import { healthRouter } from './routes/health.js';

export function createApp(): Application {
  const app = express();
  app.use(express.json());
  app.use('/health', healthRouter);
  return app;
}
```

- `createApp()` es una **factoría**: una función que construye y devuelve
  una app nueva cada vez que se llama.
- `express.json()` es un middleware que **parsea el cuerpo JSON** de las
  peticiones entrantes (no te preocupes ahora por ello los veremos en profundidad en el siguiente topic).
- `app.use('/health', healthRouter)` **monta** el router bajo la ruta
  `/health`: todas las rutas del router quedan prefijadas con `/health`.
- La función **no llama a `.listen()`**: solo devuelve `app`. Ese es el
  punto de la actividad.

### `src/routes/health.ts` — el router

```ts
import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/live', (_req, res) => {
  res.status(200).json({ status: 'live' });
});
```

- Un `Router` es un mini-Express que agrupa rutas. Montado en `/health`,
  la ruta `GET /live` queda accesible como `GET /health/live`.
- `res.status(200).json({ status: 'live' })` fija el código HTTP 200 y el
  cuerpo **exactamente** `{"status":"live"}` — sin campos extra. El cuerpo
  del endpoint es un contrato: el topic exige ese JSON literal.

### `src/server.ts` — el entry-point

```ts
import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
```

- Importa `env` (cargado en `config/env.ts`, Actividad 4) y `createApp`.
- `app.listen(env.PORT, callback)` abre el puerto; el callback se ejecuta
  cuando el servidor está escuchando e imprime la línea de arranque.
- **El orden importa**: `env.ts` se importa antes que `createApp()`, así el
  `.env` se carga (y, si falta, el proceso muere con `ENOENT`) antes de
  construir la app. Recuerda: los `import` se evalúan antes que el cuerpo
  del módulo.

## Ejercicios
- Comprueba que `curl http://localhost:3000/health/live` devuelve exactamente
  `{"status":"live"}` (Haz esta comprobación también con Bruno).
- Añade otra ruta al router de health, por ejemplo `GET /ready` que devuelva
  `{"status":"ready"}`. Comprueba que funciona. 
- Consigue que esta ruta funcione: `GET` en `http://localhost:3000/test/[nombre de tu equipo]` y que devuelva `{"team":"[nombre de tu equipo]"}`.