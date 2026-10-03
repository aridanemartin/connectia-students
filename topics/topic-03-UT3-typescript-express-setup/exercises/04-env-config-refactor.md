# Config centralizada en `src/config/env.ts` — Actividad 4

## El problema que resolvemos

En la Actividad 2 metiste estas dos líneas **sueltas** en `src/server.ts`:

```ts
process.loadEnvFile();
const PORT = Number(process.env.PORT ?? 3000);
```

Funciona perfectamente... con **una** variable y **un** fichero. Pero este
proyecto va a crecer y pronto habrá más
ficheros además de `server.ts` (en la Actividad 7 aparecen `app.ts` y
`routes/health.ts`).

Si cada fichero lee lo que necesita por su cuenta, el proyecto acaba así:

```ts
// src/server.ts
const PORT = Number(process.env.PORT ?? 3000);

// src/app.ts
const NODE_ENV = process.env.NODE_ENV ?? 'development';

// src/routes/documents.ts
const DB_URL = process.env.DATABASE_URL ?? 'postgres://localhost:5432/dev';
```

Tres problemas concretos:

1. **Nadie sabe qué variables usa el proyecto.** Para enterarte tendrías que
   buscar `process.env` por todo el código.
2. **Los valores por defecto se duplican** y, antes o después, se
   contradicen: un fichero pone `3000` y otro `8080`.
3. **La conversión se repite.** Cada lectura tiene que recordar su
   `Number()`, su `??`, y mañana su validación.

Esta actividad hace **un refactor**: mover esa lectura a un único módulo,
`src/config/env.ts`. No añadimos funcionalidad nueva — el servidor seguirá
respondiendo exactamente igual. Cambiamos **dónde** vive la configuración.

> **En tu repositorio del backend**: crea `src/config/env.ts` y haz que
> `src/server.ts` lo importe en lugar de leer `process.env` él mismo.

## Estructura de ficheros en esta actividad

Crea **un fichero nuevo** (`src/config/env.ts`) y **modifica otro**
(`src/server.ts`):

```
./   (raíz del repositorio del backend)
├── package.json     # A1-A3: sin cambios
├── tsconfig.json    # A3: sin cambios
├── .gitignore       # A2: sin cambios
├── .env.example     # A2: sin cambios (y tu .env local, no versionado)
└── src/
    ├── server.ts    # A2: MODIFICADO en A4 — importa env, ya no toca process.env
    └── config/
        └── env.ts   # A4: NUEVO — único sitio del proyecto que lee process.env
```

No se crea nada más. `eslint.config.js`, `.prettierrc.json`, `app.ts` y
`routes/health.ts` llegan en las Actividades 5-7.

## Paso 1 — el módulo nuevo: `src/config/env.ts`

```ts
process.loadEnvFile();

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};
```

Las dos líneas de la Actividad 2 **son las mismas**: solo han cambiado de
fichero. Lo nuevo es lo que las envuelve:

- **`export const env = { ... }`** — un **único objeto** de configuración. El
  resto del proyecto pedirá `env.PORT`, no `process.env.PORT`. Mirando este
  objeto sabes de un vistazo **todas** las variables que el proyecto usa:
  es la respuesta al problema 1.
- **`NODE_ENV`** entra ahora en juego. Lo declaraste en el `.env.example` de
  la Actividad 2, pero el servidor no lo leía. Aquí ya forma parte de la
  configuración y lo imprimiremos al arrancar. Fíjate en que **no** lleva
  `Number()`: es texto y se usa como texto.
- **Un único sitio con los defaults** (`?? 3000`, `?? 'development'`): es la
  respuesta a los problemas 2 y 3.

## Paso 2 — `src/server.ts` ya no toca `process.env`

```ts
import express from 'express';
import { env } from './config/env.js';

const app = express();

app.get('/health/live', (_req, res) => {
  res.status(200).json({ status: 'live' });
});

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
```

Qué ha desaparecido de este fichero: `process.loadEnvFile()`, la lectura de
`process.env.PORT` y la constante `PORT`. `server.ts` vuelve a hacer una sola
cosa: arrancar el servidor.

> **La extensión `.js` en el import no es un error**: `import { env } from
> './config/env.js'` apunta a un fichero que en disco se llama `env.ts`. En
> ESM con `moduleResolution: NodeNext` (tu `tsconfig.json` de la Actividad 3)
> los imports relativos se escriben con la extensión del fichero
> **compilado**, no la del fuente.
>
> Cuidado con la trampa: si escribes `'./config/env'` sin extensión,
> `npm run dev` **funciona igual** (`tsx` es permisivo y la resuelve por ti),
> pero `npm run build && npm start` falla con `ERR_MODULE_NOT_FOUND`, porque
> ahí ejecuta Node a secas y Node exige la ruta exacta. Es un error que no
> aparece hasta el momento más incómodo: al desplegar. Escribe siempre `.js`.

## Por qué el `.env` sigue cargándose a tiempo

Una pregunta razonable al terminar el refactor: si `process.loadEnvFile()`
ya no está en `server.ts`, **¿quién lo ejecuta, y cuándo?**

Lo ejecuta el propio `env.ts` al ser importado. La regla de ESM es que **los
`import` de un fichero se evalúan completos antes de la primera línea del
cuerpo de ese fichero**:

```text
npm run dev → tsx carga src/server.ts
                 │
                 ├─1. evalúa sus imports, en orden:
                 │     express            → cargado
                 │     ./config/env.js    → ejecuta su cuerpo:
                 │                            process.loadEnvFile()   ← el .env ya está en process.env
                 │                            export const env = {...} ← PORT y NODE_ENV ya calculados
                 │
                 └─2. AHORA ejecuta el cuerpo de server.ts:
                       const app = express()
                       app.listen(env.PORT, ...)   ← env ya tiene su valor
```

Es decir: la carga del `.env` ocurre **antes** de que exista la variable
`app`. Y lo importante es que esto vale para **cualquier** fichero que
importe `env.js`, no solo para `server.ts`.

Ese es el cuarto motivo —y el más técnico— para centralizar: mientras todo
el mundo pida la configuración a `env.js`, **es imposible leerla antes de
cargarla**. Si en cambio un fichero nuevo escribiera
`const KEY = process.env.API_KEY` en su nivel superior sin importar
`env.js`, el resultado dependería del orden en que Node cargue los módulos:
unas veces tendría valor y otras `undefined`. Son los bugs más
desagradables que existen. El módulo de configuración los elimina por
construcción.

## Qué gana el proyecto

| | Antes (A2): suelto en `server.ts` | Ahora (A4): `config/env.ts` |
|---|---|---|
| ¿Dónde se ve la lista de variables? | En ningún sitio: hay que buscar `process.env` | En el objeto `env`, de un vistazo |
| Añadir una variable nueva | Leerla y convertirla en cada fichero que la use | Una línea en `env.ts`; el resto usa `env.X` |
| Valor por defecto | Repetido en cada lectura | Uno, en `env.ts` |
| ¿Puede leerse antes de cargar el `.env`? | Sí, si te equivocas de orden | No: el cuerpo del módulo carga primero |
| Dónde irá la validación (Topic 07) | Habría que repartirla | En `env.ts`, un solo sitio |

## Lo que este fichero todavía NO hace: validar

`env.ts` **carga y convierte**, pero no comprueba nada. Y eso se nota de dos
formas distintas:

- **`NODE_ENV=prod`** (un valor inventado) pasa en silencio: el servidor
  arranca como si nada. Nadie se enterará hasta que algo se comporte raro.
- **`PORT=abc`** sí revienta... pero mal. `Number('abc')` es `NaN`, y el
  `NaN` viaja tranquilamente por `env.PORT` hasta `app.listen()`, donde Node
  lanza `RangeError [ERR_SOCKET_BAD_PORT]: options.port should be >= 0 and
  < 65536. Received type number (NaN)`. El error te habla de `options.port`
  y de sockets, no de que tu `.env` tenga un valor absurdo: aparece **lejos
  de la causa**.

Esa comprobación es la **validación**, y es el tema del Topic 07: este mismo
fichero ganará un esquema `zod` y el proceso morirá al arrancar, con un
mensaje que nombra la variable culpable, antes de que el valor malo llegue a
ningún sitio. Que hoy la configuración esté en un único módulo es justo lo
que permitirá hacerlo en un solo sitio.

## Ejercicios

**1. El refactor no ha cambiado el comportamiento.** Con tu `.env`
(`PORT=3000`, `NODE_ENV=development`), arranca con `npm run dev` y pide
`GET /health/live` con `curl` o con Bruno.
**Esperado**: `200` con `{"status":"live"}`, igual que en la Actividad 2, y
la línea de arranque ahora muestra el entorno:
`Listening on http://localhost:3000 (development)`.

**2. El entorno real manda sobre el fichero.** Sin tocar el `.env`
(que sigue diciendo `PORT=3000`), ejecuta:

```bash
PORT=4321 npm run dev
```

**Esperado**: la línea de arranque dice `4321`. `process.loadEnvFile()`
**no sobreescribe** las variables que ya existen en el entorno del proceso:
el fichero es el valor por defecto, el entorno real tiene prioridad. Es así
a propósito — en producción no hay `.env`, la configuración la inyecta el
servidor o el contenedor.

**3. El cuerpo del módulo se ejecuta de verdad.** Renombra el fichero
(`mv .env .env.bak`) y arranca.
**Esperado**: el proceso muere en menos de 2 segundos con
`Error: ENOENT: no such file or directory, open '.env'` y **sin** imprimir
`Listening on ...`. Es la prueba de que `process.loadEnvFile()` sigue
ejecutándose, aunque la llamada esté ahora en otro fichero. Restaura con
`mv .env.bak .env`.

**4. Hoy no hay validación (y se nota).** Pon `NODE_ENV=prod` en tu `.env` y
arranca.
**Esperado**: el servidor arranca sin queja y la línea dice `(prod)`.
Prueba después `PORT=abc`: **esperado**, el proceso muere con
`RangeError [ERR_SOCKET_BAD_PORT] ... Received type number (NaN)`. Lee el
error entero y responde: ¿menciona en algún momento tu `.env` o la variable
`PORT`? Eso es lo que arregla la validación del Topic 07. Deja luego tu
`.env` como estaba (`PORT=3000`, `NODE_ENV=development`).

**5. Añade una variable tú.** Declara `APP_NAME=connectia` en `.env.example`
y en tu `.env`, expórtala desde `env.ts` e imprímela en la línea de
arranque. Cuenta cuántos ficheros has tenido que tocar — y cuántos habrías
tocado si cada módulo leyera `process.env` por su cuenta.
