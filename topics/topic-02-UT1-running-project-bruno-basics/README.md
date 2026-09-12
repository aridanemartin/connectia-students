# Semana 02 — Ejecutar el proyecto y probar endpoints con Bruno

Esta semana **no escribimos backend todavía**. Practicamos las dos
herramientas que vais a usar todas las semanas del curso a partir de la
Semana 03: arrancar un proyecto Node.js desde la terminal y probar sus
endpoints HTTP con un cliente de API (Bruno) y con `curl`. Para ello
ejecutáis un demo pequeño **ya construido por el profesorado** — vosotros
no lo programáis, solo lo hacéis funcionar y lo probáis.

> **Idioma**: las explicaciones pedagógicas están en español. Los
> identificadores técnicos (`npm`, nombres de rutas, ficheros, comandos)
> van en inglés.

## Objetivos de aprendizaje

Al finalizar esta semana serás capaz de:

- Ubicar un proyecto Node.js existente, leer su `package.json` y
  ejecutar sus scripts (`install`, `dev`, `build`) sin ayuda.
- Explicar la diferencia entre `.env.example` (se versiona) y `.env` (no
  se versiona) y copiar uno a partir del otro.
- Instalar la aplicación Bruno, abrir una colección existente y enviar
  peticiones `GET` contra un servidor local.
- Leer una respuesta HTTP identificando sus tres partes: código de
  estado, cabeceras y cuerpo.
- Escribir el comando `curl` equivalente a cualquier petición de Bruno.
- Diagnosticar, a partir únicamente de la salida de la terminal, tres
  causas frecuentes de que un servidor no arranque: falta de `.env`,
  falta de una dependencia y puerto ya ocupado.

## Prerrequisitos

- **De la Semana 01**: Node.js ≥ 18 (recomendado 20 LTS) y Git ≥ 2
  instalados y verificados; acceso al repositorio del curso (material y
  demo) y a tu propio repositorio de equipo;
  equipo de 3–4 personas formado con roles asignados.
- No se asume ningún conocimiento previo de TypeScript o Express: eso
  empieza en la [Semana 03](../topic-03-UT3-typescript-express-setup/).
  Esta semana **ejecutáis** código ya escrito, no lo escribís.
- La aplicación de escritorio [Bruno](https://www.usebruno.com/downloads)
  instalada (gratuita, sin cuenta obligatoria para uso local).

## Conceptos de la semana

- **`package.json` y sus scripts** — el manifiesto de cualquier proyecto
  Node.js. Su sección `"scripts"` define comandos con nombre que se
  ejecutan con `npm run <nombre>`. Es la primera parada al abrir un
  proyecto desconocido.
- **`.env` vs `.env.example`** — `.env.example` es una plantilla pública
  que se versiona en Git; `.env` contiene los valores reales de tu
  máquina y **nunca** se versiona (está en `.gitignore`). El demo de esta
  semana solo necesita una variable: `PORT`.
- **Cliente HTTP** — un programa que envía peticiones HTTP y muestra la
  respuesta. Bruno (interfaz gráfica) y `curl` (línea de comandos) son
  dos clientes HTTP distintos que pueden enviar **exactamente la misma**
  petición; el servidor no distingue cuál la originó.
- **Colección de Bruno** — un conjunto de peticiones HTTP guardadas como
  ficheros de texto plano `.bru`, organizadas en una carpeta, que se
  versionan en Git igual que el código. Esta semana usáis una colección
  ya creada; en semanas futuras crearéis las vuestras.
- **Anatomía de una respuesta HTTP** — código de estado (`200`, `404`...),
  cabeceras (metadatos como `Content-Type`) y cuerpo (los datos, aquí
  siempre JSON).
- **Fallo de arranque** — un proceso que termina inmediatamente al
  intentar iniciarse, casi siempre por una de tres causas: configuración
  ausente, dependencia ausente, o un recurso (como un puerto de red) ya
  ocupado por otro proceso.

```mermaid
sequenceDiagram
    participant B as Bruno / curl (cliente HTTP)
    participant S as Demo backend (Express, puerto 3000)

    B->>S: GET /health
    S-->>B: 200 OK  { "status": "ok" }

    B->>S: GET /hello?name=Ada
    S-->>B: 200 OK  { "message": "Hola, Ada!" }

    B->>S: GET /does-not-exist
    S-->>B: 404 Not Found
```

Diagrama fuente: [`assets/http-request-flow.mmd`](./assets/http-request-flow.mmd).

## Ejemplo guiado

El profesor recorre en clase el demo backend de
[`code/backend/`](./code/backend/) y la colección de
[`code/bruno/`](./code/bruno/), en este orden:

1. **Explorar el proyecto sin ejecutarlo**: abre `package.json`,
   `.env.example` y `src/server.ts` en el editor. Señala la sección
   `"scripts"`, la única variable de entorno (`PORT`) y las dos rutas
   definidas (`app.get('/health', ...)`, `app.get('/hello', ...)`).
2. **Arrancarlo**:

   ```bash
   cd topics/topic-02-UT1-running-project-bruno-basics/code/backend
   cp .env.example .env
   npm install
   npm run dev
   ```

   Salida esperada (las últimas líneas):

   ```text
   > topic-02-demo-backend@1.0.0 dev
   > tsx watch src/server.ts

   Connectia Week 02 demo backend listening on http://localhost:3000
   ```

3. **Probarlo con curl**, en otra terminal:

   ```bash
   curl -sS -i http://localhost:3000/health
   ```

   ```text
   HTTP/1.1 200 OK
   Content-Type: application/json; charset=utf-8

   {"status":"ok"}
   ```

4. **Abrir la colección de Bruno**: "Open Collection" → carpeta
   `code/bruno/` → entorno `local` → enviar `01-health`. El profesor
   compara la respuesta que muestra Bruno con la que acaba de mostrar
   `curl`: son la misma petición, dos herramientas distintas.
5. **Provocar el fallo de `.env` ausente** (demostración deliberada):
   `mv .env .env.bak && npm run dev` → el proceso termina con un mensaje
   claro. Se explica por qué, y se restaura `.env`.

Todo el código de ejemplo vive en [`./code/`](./code/); instrucciones
completas de ejecución en [`code/README.md`](./code/README.md).

## Actividades del alumnado

Las actividades viven en [`./exercises/`](./exercises/). Completa todas
en orden: cada una asume que la anterior está terminada y que el demo
backend sigue corriendo desde la Actividad 2.

| # | Actividad | Plantilla | Objetivo |
|---|-----------|-----------|----------|
| 1 | Clonar y explorar el proyecto | [`01-clone-and-explore-template.md`](./exercises/01-clone-and-explore-template.md) | Leer `package.json`, `.env.example` y `src/server.ts` antes de ejecutar nada. |
| 2 | Ejecutar los scripts de npm | [`02-npm-scripts-evidence-template.md`](./exercises/02-npm-scripts-evidence-template.md) | `npm install`, `npm run typecheck`, `npm run build`, `npm run dev` con salida capturada. |
| 3 | Instalar Bruno y abrir la colección | [`03-bruno-install-and-collection-template.md`](./exercises/03-bruno-install-and-collection-template.md) | Instalar la app, abrir `code/bruno/`, seleccionar el entorno `local`. |
| 4 | Enviar GET /health y leer la respuesta | [`04-get-request-health-evidence-template.md`](./exercises/04-get-request-health-evidence-template.md) | Identificar código de estado, cabeceras y cuerpo; escribir el curl equivalente. |
| 5 | Enviar GET /hello con parámetro | [`05-get-request-hello-evidence-template.md`](./exercises/05-get-request-hello-evidence-template.md) | Comparar la respuesta con y sin `name`; escribir los curl equivalentes. |
| 6 | De Bruno a curl (tabla completa) | [`06-curl-equivalents-template.md`](./exercises/06-curl-equivalents-template.md) | Consolidar el comando curl de las cuatro peticiones de la colección. |
| 7 | Diagnosticar un servidor que no arranca | [`07-diagnose-broken-server-template.md`](./exercises/07-diagnose-broken-server-template.md) | Reproducir y explicar: `.env` ausente, dependencia ausente, puerto ocupado. |

## Incremento semanal del proyecto

Esta semana el "incremento" no es código de equipo (eso empieza en la
Semana 03): es **capacidad demostrada**. Al final de la Semana 02, cada
equipo tiene:

- Las siete plantillas de `exercises/` completadas en
  `team-docs/week-02/`, con salida de terminal y capturas de Bruno
  reales (no inventadas).
- Evidencia de que el equipo completo sabe arrancar un proyecto Node.js
  ajeno sin ayuda del profesorado.
- Evidencia de que el equipo completo sabe usar Bruno y `curl` de forma
  intercambiable para probar un endpoint.

No se entrega backend propio del equipo: el `code/backend/` y el
`code/bruno/` de esta semana son material de referencia compartido,
idéntico para todos los equipos.

## Criterios de aceptación

- [ ] `npm install`, `npm run typecheck`, `npm run build` y `npm run dev`
  ejecutados con éxito por cada miembro del equipo, con salida capturada.
- [ ] La colección de Bruno se abre sin errores y las cuatro peticiones
  (`01-health`, `02-hello-default`, `03-hello-with-name`,
  `04-not-found-demo`) se envían con éxito contra el demo backend en
  ejecución.
- [ ] Los cuatro códigos de estado observados son exactamente `200`,
  `200`, `200` y `404`, con los cuerpos JSON documentados.
- [ ] Existe un comando `curl` equivalente, correcto y probado, para cada
  una de las cuatro peticiones.
- [ ] Los tres escenarios de fallo de arranque (`.env` ausente,
  `node_modules/` ausente, puerto ocupado) están reproducidos con salida
  de terminal literal y explicados correctamente.
- [ ] El proyecto queda en estado funcional al finalizar la semana
  (`.env` presente, `node_modules/` presente, ningún proceso zombi
  ocupando el puerto `3000`).

## Errores comunes y depuración

- **Síntoma**: `npm run dev` termina con `Missing required environment
  variable: PORT.`
  **Causa habitual**: no se copió `.env.example` a `.env` (Actividad 7,
  Escenario A).
  **Cómo depurarlo**: `cp .env.example .env` dentro de `code/backend/` y
  volver a ejecutar `npm run dev`.

- **Síntoma**: `sh: tsx: command not found` (o un error de módulo no
  encontrado) al ejecutar `npm run dev`.
  **Causa habitual**: no se ejecutó `npm install`, o `node_modules/` fue
  borrado o movido (Actividad 7, Escenario B).
  **Cómo depurarlo**: ejecutar `npm install` dentro de `code/backend/` y
  reintentar.

- **Síntoma**: `npm run dev` termina con `Port 3000 is already in use.`
  **Causa habitual**: ya hay otra copia del demo (u otro proceso)
  escuchando en el puerto `3000` (Actividad 7, Escenario C).
  **Cómo depurarlo**: detener el proceso anterior (`Ctrl+C` en su
  terminal) o cambiar `PORT` en `.env` y volver a intentar.

- **Síntoma**: en Bruno, la petición se queda "cargando" indefinidamente
  o falla con un error de conexión.
  **Causa habitual**: el demo backend no está corriendo, o el entorno
  seleccionado en Bruno no es `local` (o su `baseUrl` no es
  `http://localhost:3000`).
  **Cómo depurarlo**: confirmar en la terminal que `npm run dev` sigue
  activo; revisar el selector de entorno en la esquina superior derecha
  de Bruno.

- **Síntoma**: `GET /hello` sin `name` devuelve `{"message":"Hola,
  mundo!"}` y el alumnado piensa que es un error.
  **Causa habitual**: expectativa de que faltar un parámetro debería dar
  un error `400`.
  **Cómo depurarlo**: recordar la regla de esta semana — el demo usa un
  valor por defecto (`"mundo"`) en vez de fallar; la validación estricta
  de parámetros de entrada es un tema de la Semana 05 (REST y
  validación), no de esta semana.

## Mapeo DSW — RA1

> ⚠️ **Identificadores pendientes**: `references/dsw-learning-outcomes.md`
> está aún como PENDIENTE. Los identificadores de criterio siguen el
> patrón `RA1.CE-pending-N` hasta que se incorpore el texto oficial. Solo
> se actualizará el identificador y el texto abreviado; la actividad y la
> evidencia ya son válidas.

| RA | Criterio de evaluación | Evidencia esta semana |
|----|------------------------|------------------------|
| RA1 | `RA1.CE-pending-1` — *pendiente texto oficial* | Cada equipo ejecuta `npm install`, `npm run build` y `npm run dev` con éxito sobre un proyecto Node.js + TypeScript + Express existente (Actividades 1–2). |
| RA1 | `RA1.CE-pending-2` — *pendiente texto oficial* | Cada equipo instala Bruno, abre una colección existente y envía las cuatro peticiones documentadas, leyendo correctamente estado, cabeceras y cuerpo (Actividades 3–5). |
| RA1 | `RA1.CE-pending-3` — *pendiente texto oficial* | Cada equipo escribe el comando `curl` equivalente y correcto para cada petición de la colección (Actividad 6). |
| RA1 | `RA1.CE-pending-4` — *pendiente texto oficial* | Cada equipo reproduce y explica correctamente tres causas frecuentes de fallo de arranque de un servidor (Actividad 7). |

Referencia normativa (pendiente):
[`references/dsw-learning-outcomes.md`](../../references/dsw-learning-outcomes.md).

## Autoevaluación

Responde a cada pregunta con **sí / con dudas / no**. Si respondes "con
dudas" o "no" a alguna, revisa la sección correspondiente antes de
continuar a la Semana 03.

- ¿Puedo abrir un proyecto Node.js desconocido y averiguar qué comandos
  ejecutar mirando solo su `package.json`?
- ¿Puedo explicar por qué `.env.example` se versiona en Git y `.env` no?
- ¿Puedo enviar una petición con Bruno y leer correctamente su código de
  estado, sus cabeceras y su cuerpo?
- ¿Puedo escribir de memoria el comando `curl` equivalente a una petición
  `GET` sencilla, con y sin parámetros de consulta?
- ¿Puedo diagnosticar, solo con la salida de la terminal, si un servidor
  no arranca por falta de `.env`, falta de dependencias o puerto
  ocupado?

## Syllabus

Consulta [`syllabus/README.md`](./syllabus/README.md) para la lista de items que debes conocer al superar esta semana.
