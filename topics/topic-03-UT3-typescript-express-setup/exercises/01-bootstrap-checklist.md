# `package.json` y el servidor mínimo — Actividad 1

IMPORTANTE: NO haremos commit de esta actividad. Solo se hace commit en la Actividad 2.

## Qué haremos durante este topic

Durante el Topic 03 montamos la *estructura básica* de nuestro proyecto.
Esta Actividad 1 es deliberadamente **mínima**: creamos el **manifiesto**
(`package.json`), aprendemos a instalar dependencias y escribimos el
**primer servidor** (`src/server.ts`), que **arranca y responde** al
terminar la actividad. En esta actividad creamos:

- el manifiesto del proyecto, `package.json`;
- el fichero `src/server.ts`.

El servidor de hoy tiene el puerto **escrito en el código**: es lo más
simple que funciona. En la Actividad 2 veremos por qué eso es un problema y
lo sacaremos a un fichero de configuración (`.env`), junto con el
`.gitignore`. Las demás piezas del proyecto de referencia (`tsconfig.json`,
linter, formateador, `config/env.ts`, la separación app/server) llegan en
las Actividades 3 a 7, cada una cuando se explica.

No copies nada a ciegas: mientras creas cada fichero, lee la columna
*Para qué sirve*. Esa comprensión es el objetivo real.

## Backend path

Raíz del **repositorio del backend** (`./`)

> **Importante**: el backend vive en un **repositorio propio y aparte** del
> repositorio de documentación del equipo. El proyecto Node.js se crea en la
> **raíz** de ese repositorio de backend, como un proyecto normal; **no** se
> crea dentro de `team-docs/`, que pertenece al repositorio de
> documentación. A partir de este topic, todo lo que construyáis va a ese
> repositorio de backend.

> **En tu repositorio del backend**: crea `package.json` y `src/server.ts`
> en su **raíz**, instala sus dependencias (ver la sección de
> `package.json`), arranca el servidor con `npm run dev` y comprueba que
> `GET /health/live` responde.
>
> **Avance de vuestra API**: aquí nace el backend de documents/questions;
> todavía no hay endpoints de dominio, pero ya existe el proyecto —y el
> servidor— sobre el que se añadirán.

## Estructura de ficheros que debes crear en esta actividad

Crea **estas dos piezas**:

```
./   (raíz del repositorio del backend)
├── package.json     # manifiesto del proyecto (npm lo necesita para todo)
└── src/
    └── server.ts    # servidor único: crea la app, sirve /health/live y escucha en el puerto
```

`.gitignore`, `.env.example` y `.env` se añaden en la Actividad 2.
`tsconfig.json`, `eslint.config.js`, `.prettierrc.json`, `config/env.ts`,
`app.ts` y `routes/health.ts` se añaden en las Actividades 3-7.

## Apuntes: qué es cada fichero

### `package.json` — el "DNI" del proyecto

Node.js **no sabe nada de un proyecto hasta que existe su `package.json`**:
sin él no hay `npm install`, ni `npm run dev`, ni dependencias. Los campos
que usamos hoy:

- `"name"` y `"version"`: identifican el paquete. Es un proyecto privado de
  curso, con `"private": true` para que npm **nunca** intente publicarlo.
- `"type": "module"`: declara que todos los `.js` y `.mjs` del proyecto
  usan **ES Modules (javascript moderno)** (`import` / `export`), no **CommonJS (javascript clásico)**  (`require`).
  Con esto, `import express from 'express'` funciona directamente.
- `"engines": { "node": ">=20.19.0" }`: avisa a quien instale que el
  proyecto requiere Node 20.19 o superior (en la Actividad 2 usaremos
  `process.loadEnvFile()`, que necesita Node ≥ 20.12).
- `"scripts"`: los comandos con nombre. Hoy solo existe `dev`; los demás
  (`typecheck`, `build`, `start`, `lint`, `format`) llegan con sus
  herramientas en las Actividades 3, 5 y 6.

Empezamos con un `package.json` **vacío de dependencias**: solo los campos
de arriba y el script `dev`. Todavía no existen `dependencies` ni
`devDependencies`:

```json
{
  "name": "connectia-backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20.19.0"
  },
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

El script `dev` todavía no arranca nada: usa `tsx`, que instalamos en el
paso 2. Y **no escribas las dependencias a mano**: lo normal es que se
añadan solas al instalar. Ese es el flujo real de npm y conviene verlo desde
el principio.

#### 1. Qué es una dependencia de producción y cómo la instalamos (`dependencies`)

Son los paquetes que la aplicación necesita **en ejecución, también en
producción**. Express es el servidor HTTP que usaremos:

```bash
npm install express@5
```

> El `@5` fija la **versión mayor**: npm instalará la última versión 5.x,
> pero nunca una 6 que pudiera romper el código del curso. Lo haremos así con
> todas las librerías: el proyecto crece topic a topic y todos los equipos
> tienen que trabajar con las mismas versiones.

Al terminar, npm ha descargado Express en `node_modules/` y ha **añadido
automáticamente** el campo `dependencies` a tu `package.json`:

```json
  "dependencies": {
    "express": "^5.2.0"
  }
```

#### 2. Qué es una dependencia de desarrollo y cómo la instalamos (`devDependencies`)

Son los paquetes que solo necesitas **mientras desarrollas** (ejecutar
TypeScript, lintar, formatear...). El flag `-D` (o `--save-dev`) le dice a
npm que la guarde en `devDependencies`. `tsx` ejecuta TypeScript
directamente, con recarga en caliente al guardar:

```bash
npm install -D tsx@4
```

npm añade entonces el campo `devDependencies`:

```json
  "devDependencies": {
    "tsx": "^4.19.1"
  }
```

#### `dependencies` vs `devDependencies`

| | `dependencies` | `devDependencies` |
|---|---|---|
| ¿Cuándo se usa? | En desarrollo **y** en producción | Solo en desarrollo |
| Ejemplos | `express`, `zod`, un driver de base de datos | `tsx`, `typescript`, ESLint, Prettier |
| Comando | `npm install <paquete>` | `npm install -D <paquete>` |
| Al desplegar | Se instala | **No** se instala (`npm install --omit=dev`) |

La regla práctica: pregúntate *"¿el servidor en producción necesita este
paquete para responder peticiones?"*. Si la respuesta es sí →
`dependencies`; si solo lo usas tú mientras programas → `devDependencies`.

Con las dos instalaciones hechas, el `package.json` queda así (fíjate en que
todavía **no** aparecen los scripts `typecheck`, `build`, `start`, `lint` ni
`format`: cada uno se añade en la actividad que lo explica):

```json
{
  "name": "connectia-backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20.19.0"
  },
  "scripts": {
    "dev": "tsx watch src/server.ts"
  },
  "dependencies": {
    "express": "^5.2.0"
  },
  "devDependencies": {
    "tsx": "^4.19.1"
  }
}
```

En esta actividad instalamos **una** dependencia de producción (`express`) y
**una** de desarrollo (`tsx`). En Topics posteriores se añadirán más; el
principio ya queda claro: `dependencies` son los paquetes que la aplicación
necesita **en producción** y `devDependencies` los que solo usas para
desarrollar.

### El `src/server.ts` de esta actividad

Un solo fichero que crea la aplicación, declara una ruta y abre el puerto.
Son **tres pasos**, en este orden:

```ts
import express from 'express';

const PORT = 3000; // puerto fijo, escrito en el código (en la Actividad 2 saldrá de un fichero)

const app = express(); // 1. crea la app Express y la guarda en la variable `app`

app.get('/health/live', (_req, res) => { // 2. nuestro primer endpoint: responde exactamente {"status":"live"} con status 200
  res.status(200).json({ status: 'live' });
});

app.listen(PORT, () => { // 3. abre el puerto y deja el proceso escuchando peticiones
  console.log(`Listening on http://localhost:${PORT}`);
});
```

Qué hace cada pieza:

| Línea | Para qué sirve |
|---|---|
| `const app = express()` | Construye la aplicación: un objeto al que se le van **añadiendo** rutas. Crear la app **no** abre ningún puerto. |
| `app.get('/health/live', ...)` | Registra un **handler**: "cuando llegue un `GET` a esta ruta, ejecuta esta función". |
| `res.status(200).json({...})` | Construye la respuesta: código de estado y cuerpo JSON. Express pone por ti la cabecera `Content-Type: application/json`. |
| `app.listen(PORT, ...)` | **Ahora sí** abre el puerto `3000` y se queda escuchando. El callback se ejecuta una vez, cuando el servidor ya está listo. |

> Sobre la firma `(_req, res)`: Express crea por cada petición un objeto
> `req` (la petición entrante) y un objeto `res` (la respuesta que
> construyes y envías) y **se los pasa a tu función**. Esta ruta no
> necesita leer nada de la petición — por eso el parámetro lleva `_` y
> se ignora. En la Actividad 8 abriremos ambos objetos y haremos el
> primer log del servidor.

> **El puerto está `hardcodeado`** (escrito a mano en el código). Funciona,
> pero cambiarlo obliga a **editar el código** y recompilar, y cada persona
> del equipo necesitaría su propia versión del fichero. La Actividad 2
> arregla exactamente eso: la configuración saldrá del código a un fichero
> `.env`.

## Arrancar el servidor

Ya tienes todo lo necesario para verlo funcionar:

1. Ejecuta `npm run dev`.
2. En **otra terminal**: `curl -sS -i http://localhost:3000/health/live` y prueba también con Bruno.
3. **Esperado**: `HTTP/1.1 200 OK` y cuerpo exacto `{"status":"live"}`.

> Si ves `Error: listen EADDRINUSE :3000`, tienes otro proceso ocupando el
> puerto: Para parar un proceso en un puerto, usa `lsof -i :3000` en macOS/Linux o `netstat -ano | findstr :3000` en Windows y vuelve a arrancar.

## Ejercicios

- Prueba que pasa si cambias el número de puerto. Prueba por ejemplo con el `3001`. Arranca el servidor y haz la petición de nuevo.
- Prueba a cambiar la ruta `/health/live` por otra, por ejemplo `/health`. Arranca el servidor y haz la petición de nuevo. ¿Qué pasa si haces la petición a la ruta antigua?
  