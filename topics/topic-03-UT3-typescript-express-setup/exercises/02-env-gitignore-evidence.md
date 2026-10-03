# `.gitignore` y variables de entorno — Actividad 2

## Qué se añade en esta actividad

La Actividad 1 dejó un servidor que **ya funciona**: `npm run dev` arranca y
`GET /health/live` responde `200`. Pero dejó también **dos problemas
abiertos**:

1. Si abrimos la pestaña de Git en el VS Code, veremos que **Git quiere versionar `node_modules/`.** El package.json justo sirve para que cada persona pueda reconstruir `node_modules/` con `npm install`, así que no tiene sentido subirlo al repositorio. 
2. **El puerto está escrito en el código** (`const PORT = 3000`). Para
   cambiarlo hay que editar el fichero fuente, y cada persona del equipo
   tendría que mantener su propia versión.

Esta actividad resuelve los dos con **tres ficheros nuevos** y una
**modificación pequeña** de `src/server.ts`:

- **`.gitignore`** — las rutas que Git **nunca** debe versionar (contar con ellas para subirlas al repositorio)
  (`node_modules/`, `dist/`, `.env`).
- **`.env.example`** — Es una plantilla pública (sí versionada) que dice qué
  variables de entorno se necesitan para configurar el proyecto pero los valores que tiene son ejemplos falsos. Por ejemplo `API_KEY=1234567890` es un ejemplo, no tu clave real.
- **`.env`** — tus valores reales (no versionado). Este fichero **NUNCA** se sube al repositorio: contiene secretos y configuración local de cada persona.
- **`src/server.ts`** — deja de tener el puerto escrito a mano: Ahora lo leerá de las variables de entorno.

> **En tu repositorio del backend**: crea `.gitignore` y `.env.example`,
> copia `.env.example` a `.env`, modifica `src/server.ts` para que lea el
> puerto de la configuración y comprueba que **cambiando solo el `.env`**
> el servidor arranca en otro puerto.

## Estructura de ficheros que debes crear en esta actividad

Crea **dos ficheros** (`.gitignore`, `.env.example`), **una copia local no
versionada** (`.env`) y **modifica** `src/server.ts`:

```
./   (raíz del repositorio del backend)
├── package.json     # A1: sin cambios
├── .gitignore       # A2: NUEVO — rutas que Git debe ignorar
├── .env.example     # A2: NUEVO — plantilla pública (se versiona)
├── .env             # A2: NUEVO — tus valores reales (NO se versiona)
└── src/
    └── server.ts    # A1: MODIFICADO en A2 — carga el .env y lee PORT
```

No se crea nada más en esta actividad. `tsconfig.json`, `eslint.config.js`,
`.prettierrc.json`, `config/env.ts`, `app.ts` y `routes/health.ts` se añaden
en las Actividades 3-7.

## Apuntes: `.gitignore`

Git versiona **todo** lo que no esté en `.gitignore`. Por eso es importante crear este fichero **antes de tu primer commit**. En él se listan las cosas que **no** deben llegar nunca al repositorio:

- `node_modules/`: miles de ficheros de dependencias que se reconstruyen con
  `npm install`. Versionarlos sería ruido y peso inútil.
- `dist/`: la salida del build (llega en la Actividad 3). Se regenera con
  `npm run build`.
- `.env`: contiene tus valores reales (y secretos, si algún día hay).

`.gitignore` es la lista de rutas que Git ignora. El de esta actividad:

```gitignore
node_modules/
dist/
.env
```

Fíjate en que `.env` está ignorado pero `.env.example` **no** (no aparece en la lista): la plantilla pública sí se versiona.

> **Orden importa**: crea el `.gitignore` **antes** de tu primer `commit`.
> Si `node_modules/` ya estuviera versionado, añadirlo al `.gitignore` no lo
> saca del repositorio — Git sigue siguiendo lo que ya rastrea.

## Apuntes: `.env.example` y `.env`

Una **variable de entorno** es configuración que llega al proceso desde
fuera del código: puerto, URLs, claves... En Node.js viven en `process.env`.
En lugar de escribirlas en el código, las guardamos en un fichero `.env` en
la raíz.

Son **dos ficheros distintos** y no deben confundirse:

| | `.env.example` | `.env` |
|---|---|---|
| Contenido | Valores de ejemplo | Tus valores reales |
| ¿Se versiona? | **Sí** | **No** (está en `.gitignore`) |
| Para qué | Contrato: dice qué variables existen | Configuración local de cada persona |

## Apuntes: cómo lee el servidor la configuración

El `src/server.ts` de la Actividad 1 tenía el puerto escrito a mano:

```ts
const PORT = 3000; // ← lo que vamos a eliminar
```

Lo sustituimos por **dos líneas**: una que carga el fichero y otra que lee
el valor.

```ts
import express from 'express';

process.loadEnvFile();  // 1. lee el .env de la raíz y vuelca sus valores en process.env

const PORT = Number(process.env.PORT ?? 3000); // 2. lee la variable de entorno PORT de process.env (o usa 3000 si no está)

const app = express();

app.get('/health/live', (_req, res) => {
  res.status(200).json({ status: 'live' });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
```

Línea por línea:

- **`process.loadEnvFile()`** es una función **nativa de Node** (Node ≥
  20.12, sin instalar ninguna librería): lee el `.env` de la raíz y vuelca
  sus pares nombre→valor en `process.env`. Tiene que ejecutarse **antes** de
  leer `process.env.PORT`; si se invirtiera el orden, `process.env.PORT`
  estaría vacío.
- **`process.env.PORT`** devuelve siempre `string | undefined` — nunca un
  número. Todo lo que llega del entorno es texto.
- **`?? 3000`** aporta un valor por defecto *solo* si `process.env.PORT` es
  `undefined` (o `null`). Es la red de seguridad: el servidor arranca
  aunque la variable no esté declarada.
- **`Number(...)`** convierte el texto `"3000"` en el número `3000`, que es
  lo que `app.listen()` espera.

> **El `.env` es obligatorio**: si no existe, `process.loadEnvFile()` lanza
> un error `ENOENT` y el proceso muere al instante. Es deliberado
> (*fail-fast*): mejor no arrancar que arrancar mal configurado. Lo
> mediremos con detalle en la Actividad 4.

## Ejercicio 1 — nada se ha roto

Con el `.env` ya creado (`PORT=3000`):

1. Ejecuta `npm run dev`.
2. En **otra terminal**: `curl -sS -i http://localhost:3000/health/live`.
3. **Esperado**: exactamente lo mismo que en la Actividad 1 —
   `HTTP/1.1 200 OK` y cuerpo `{"status":"live"}`.

## Ejercicio 2 — cambiar el puerto SIN tocar el código

Aquí se ve para qué sirve todo esto:

1. Para el servidor (`Ctrl+C`).
2. Edita **solo** tu `.env` y pon `PORT=4000`. **No toques `src/server.ts`.**
3. `npm run dev` → la línea de arranque debe decir `http://localhost:4000`.
4. `curl -sS -i http://localhost:4000/health/live` → `200` con
   `{"status":"live"}`.
5. Después de probar, vuelve a dejar `PORT=3000` en tu `.env` (las actividades siguientes
   asumen el 3000).


