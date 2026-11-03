# Actividad 04 — Probar con `curl` y Bruno

## Objetivo

Comprobar que cada endpoint responde con el **estado** y el **cuerpo**
esperados, usando `curl` y Bruno.

> **Dónde trabaja el equipo**: contra el backend del equipo en marcha
> (`npm run dev`).

## Apuntes: `curl -i` muestra el estado

```bash
curl -i http://localhost:3000/api/v1/admin/documents
```

La primera línea es el estado (`HTTP/1.1 200 OK`); después, las cabeceras y el
cuerpo. En Bruno, el código de estado y el cuerpo aparecen en el panel de
respuesta.

## Ejercicio

El equipo ejecuta y captura cada caso:

| # | Petición | Estado esperado |
|---|----------|-----------------|
| 1 | `GET /api/v1/admin/documents` | `200` |
| 2 | `POST /api/v1/admin/documents` con `{"title":"X"}` | `201` |
| 3 | `POST /api/v1/admin/documents` con `{}` | `400` |
| 4 | `GET /api/v1/admin/documents/<id inexistente>` | `404` |
| 5 | `GET /api/v1/admin/documents?page=1&limit=1` | `200` con **un** documento y `pagination` |
| 6 | `PATCH /api/v1/admin/documents/<id de la fila 2>` con `{"title":"Y"}` | `200` |
| 7 | `POST /api/v1/questions` con `{"question":"hola"}` | `200` |
| 8 | `POST /api/v1/questions` con `{"question":"  "}` | `400` |
| 9 | `GET /health/live` (del Topic 03) | `200` |

## Ejercicio: la colección de Bruno del equipo

Hasta ahora el equipo ha usado una colección que ya estaba hecha (la del
Topic 02). Ahora crea **la suya**: una única colección con **una petición
por cada fila** de la tabla anterior, guardada en el repositorio del
backend. Así las pruebas no se pierden: el equipo puede volver a lanzarlas
con un clic en vez de reescribir los `curl`.

### Paso 1 — Crear la colección

1. En Bruno, **`+`** → **Create Collection**.
2. Nombre: `connectia`.
3. En las opciones avanzadas (icono de ajustes), la ubicación es la carpeta
   `bruno/` en la raíz del **repositorio del backend** del equipo (si no
   existe, se crea). Bruno crea dentro una subcarpeta con el nombre de la
   colección: `bruno/connectia/`.
4. Se deja el formato de fichero que proponga Bruno y se pulsa **Create**.

### Paso 2 — Crear el entorno `local`

Como en el Topic 02, la URL base no se escribe en cada petición:

1. Arriba a la derecha, **No Environment** → **Configure** → **Create**.
2. Nombre: `local`. Variable `baseUrl` con valor `http://localhost:3000`.
3. Se guarda y se **selecciona** el entorno `local`.

### Paso 3 — Una petición por prueba

La colección tiene las nueve peticiones de la tabla (clic derecho sobre la
colección → **New Request**). Cada una cumple:

- **Nombre**: empieza por el número de la fila, para que salgan en orden:
  `01 - Listar documentos`, `02 - Crear documento`, `03 - Crear sin título
  (400)`…
- **URL**: usa la variable, nunca la dirección escrita a mano:
  `{{baseUrl}}/api/v1/admin/documents`.
- **Body** (solo en `POST` y `PATCH`): pestaña **Body** → **JSON** con el
  cuerpo de la tabla.
- **Query** (fila 5): en la pestaña **Params** (`page` = `1`, `limit` =
  `1`); Bruno la añade a la URL.
- **Assert**: en la pestaña **Assert**, `res.status` · `eq` · el estado
  esperado (por ejemplo `eq 201`). Así Bruno marca en verde o en rojo si la
  prueba pasa, sin tener que mirar el número.
- **Guardada** (`Ctrl+S` / `Cmd+S`). Una petición sin guardar no se escribe
  en disco y no llega al repositorio.

La fila 6 necesita el `id` del documento creado en la fila 2: se copia de
la respuesta de la petición `02` y se pega en la URL de la `06`. La fila 4
usa un `id` que no exista (`no-existe`).

El equipo envía cada petición y comprueba que el resultado coincide con el
de `curl`: **debe ser la misma petición**, solo cambia la herramienta.

### Paso 4 — Subir la colección al repositorio

Al terminar, al clonar o actualizar el repositorio del equipo, la carpeta
`bruno/connectia/` se abre en Bruno con **Open Collection** y muestra las
nueve peticiones, que pasan su `Assert` contra el backend en marcha.

> **Recuerda**: los datos viven en memoria. Al reiniciar el servidor, el
> documento de la fila 2 desaparece y la fila 6 da `404`. Hay que volver a
> lanzar la `02` y actualizar el `id` de la `06`.

### Extra (opcional) — Encadenar el `id` automáticamente

Copiar el `id` a mano cada vez es pesado. Bruno puede guardarlo:

1. En la petición `02 - Crear documento`, pestaña **Vars** →
   **Post Response**, la variable `documentId` con el valor
   `res.body.data.id`.
2. En la petición `06`, el `id` de la URL pasa a ser `{{documentId}}`:
   `{{baseUrl}}/api/v1/admin/documents/{{documentId}}`.
3. El botón **Run** de la colección (Runner) lanza las nueve peticiones en
   orden y muestra cuántas pasan sus `Assert`.
