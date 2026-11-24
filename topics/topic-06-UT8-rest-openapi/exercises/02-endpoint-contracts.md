# Actividad 02 — El contrato de cada endpoint

## Objetivo

Decidir el **contrato completo** de cada operación —método, ruta, ubicación de
cada dato, respuesta de éxito y errores— antes de implementar la lógica, y
escribir una operación de ejemplo en OpenAPI.

## Para qué sirve esta actividad

Ya sabemos crear el mapa de recursos y rutas. Ahora hay que rellenar el **contrato**:
para cada operación, qué método, qué entrada (en `path`, `query` o `body`), qué
respuesta de éxito y qué errores. Si dos personas del equipo leen la tabla y
predicen **exactamente** las mismas peticiones y respuestas sin ver el código,
el contrato está bien escrito.

> Seguimos usando la **API inventada de biblioteca**
> ([`assets/openapi-basic.yaml`](../assets/openapi-basic.yaml)) para los
> ejemplos. La [chuleta de OpenAPI](../assets/openapi-cheatsheet.md) tiene las
> piezas de sintaxis que aparecen aquí.

## Apuntes 1: cómo elegir el método

| Operación | Método | Por qué | Ejemplo |
|-----------|--------|---------|---------|
| Consultar la lista de un recurso | `GET` | Consulta sin efectos secundarios: no crea ni modifica nada. | `/api/v1/books` nos devuelve la lista de libros.  |
| Consultar un elemento | `GET` | Lee un recurso concreto. |`/api/v1/books/{bookId}` nos devuelve el libro con ese ID. |
| Crear un recurso | `POST` | Crea un elemento nuevo; el servidor decide el identificador. | `POST /api/v1/books` crea un libro y devuelve su `bookId`. |
| Procesar algo y devolver un resultado | `POST` | El servidor decide el resultado, aunque no cree un recurso consultable. | `POST /api/v1/questions` recibe una pregunta y devuelve una respuesta. |
| Actualizar **parte** de un recurso | `PATCH` | Solo se envían los campos que cambian. `PUT` sería para reemplazar el recurso entero. | `PATCH /api/v1/books/{bookId}` actualiza parte del libro con ese ID. Por ejemplo el título. |

## Apuntes 2: dónde va cada dato (`path`, `query` o `body`)

| Ubicación | Qué transporta | Ejemplo (biblioteca) | En OpenAPI |
|-----------|----------------|----------------------|------------|
| `path` | Identifica el recurso concreto | `bookId` | parámetro `in: path` |
| `query` | Ajusta *cómo* se consulta: filtros, paginación | `page`, `limit`, `author` | parámetro `in: query` |
| `body` | Datos que se crean o se modifican | `title`, `author`, `year` | `requestBody` |

Mira cómo se declaran `path` y `query` en el ejemplo inventado:

```yaml
# Parámetro de QUERY: opcional, ajusta la consulta.
parameters:
  - name: page
    in: query
    required: false
    schema:
      type: integer
      minimum: 1
      default: 1

# Parámetro de PATH: obligatorio, identifica el recurso.
parameters:
  - name: bookId
    in: path
    required: true
    schema:
      type: string
      format: uuid
```

Y el `body`, que solo existe en operaciones que envían datos:

```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/CreateBookRequest'
```

Regla de oro: **ningún dato puede estar en dos ubicaciones**. Si `bookId` ya
está en el path, no se repite en el body.

## Apuntes 3: recuerda que solo puede haber un estado de éxito

Elige **un único** código de éxito por operación:

| Operación | Éxito | Por qué |
|-----------|-------|---------|
| `GET` (listar o consultar) | `200` | Lectura correcta. |
| `POST` que **crea** un recurso | `201` | `201 Created` es su semántica; además se suele devolver el recurso creado. |
| `POST` que **procesa** sin crear recurso | `200` | El servidor devuelve un resultado (la respuesta simulada), no un recurso consultable. |
| `PATCH` (actualizar) | `200` | Actualización correcta. |

En OpenAPI, cada código es una clave entre comillas con su `description` y, si
hay cuerpo, su `schema`:

```yaml
responses:
  '201':
    description: Libro creado
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Book'
```

## Apuntes 4: los errores se deciden por ubicación de la entrada

No hay que documentar todos los errores imaginables, pero sí los que el
contrato promete. Estos son los del topic:

| Situación | Estado | Código interno (`error`) |
|-----------|--------|----------------|
| Entrada mal formada (body, query o **UUID con formato incorrecto**) | `400` | `VALIDATION_ERROR` (`INVALID_JSON` si el JSON está roto) |
| Identificador válido que **no existe** | `404` | `NOT_FOUND` |
| Fallo inesperado | `500` | `INTERNAL_ERROR` |

La distinción `400` frente a `404` para el identificador es un criterio de
aceptación del topic:

> **`400`** = "la forma no es válida" (`not-a-uuid`).
> **`404`** = "la forma es válida, pero el recurso no existe"
> (`99999999-9999-4999-8999-999999999999`).

Todos los errores comparten la misma envoltura: la `{ error, message }` que
ya responde vuestro `errorHandler` del Topic 05. Los errores de validación
añaden la lista `issues`, con **dónde** está el dato (`location`), **qué
campo** falla (`path`) y **por qué** (`message`). Este sería un `400` de la
API inventada:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "La solicitud contiene datos no válidos.",
  "issues": [
    {
      "location": "body",
      "path": ["year"],
      "message": "El año debe estar entre 1450 y 2100."
    }
  ]
}
```

> Hoy vuestras comprobaciones a mano responden `BAD_REQUEST` sin `issues`.
> El contrato describe a dónde queremos llegar: en el Topic 07 el middleware
> `validate` hará que el servidor responda exactamente esto.

Y así se declara una respuesta de error reutilizable:

```yaml
components:
  responses:
    BadRequest:
      description: La solicitud contiene datos no válidos.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
```

## Ejemplo resuelto: "crear un libro" de principio a fin

**Fila de la tabla:**

| Operación | Método | Ruta | Path input | Query input | Body input | Éxito | Errores |
|-----------|--------|------|------------|-------------|------------|-------|---------|
| Crear un libro | `POST` | `/api/v1/books` | — | — | `title:string`, `author:string`, `year:int` | `201` | `400`, `500` |

**Petición de ejemplo:**

```json
{
  "title": "El Quijote",
  "author": "Miguel de Cervantes",
  "year": 1605
}
```

**Respuesta de ejemplo (`201`):**

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "title": "El Quijote",
  "author": "Miguel de Cervantes",
  "year": 1605,
  "available": true,
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

> En vuestro proyecto las respuestas de éxito van dentro de `data`
> (`{ "data": { ... } }`), como ya hacéis desde el Topic 04. El ejemplo de la
> biblioteca no usa envoltorio para que la sintaxis se vea más limpia.

**Operación OpenAPI completa:**

```yaml
/api/v1/books:
  post:
    tags: [Books]
    operationId: createBook
    summary: Crear un libro
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CreateBookRequest'
    responses:
      '201':
        description: Libro creado
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Book'
      '400':
        $ref: '#/components/responses/BadRequest'
      '500':
        $ref: '#/components/responses/InternalError'
```

Observa que `$ref` solo *referencia*: las formas `CreateBookRequest`, `Book` y
`ErrorResponse` se definen una sola vez en `components.schemas` (míralo en
[`assets/openapi-components.yaml`](../assets/openapi-components.yaml)).

## EJERCICIO: el contrato completo de tu API

Ahora aplica todo lo anterior a **tus cinco endpoints** (los de la tabla de la
Actividad 01).

### 1. Tabla de contratos

Rellena una fila por operación:

| Operación | Método | Ruta | Path input | Query input | Body input | Éxito | Errores |
|-----------|--------|------|------------|-------------|------------|-------|---------|
| Formular una pregunta | | | | | | | |
| Listar documentos | | | | | | | |
| Crear metadatos de un documento | | | | | | | |
| Consultar un documento | | | | | | | |
| Actualizar metadatos | | | | | | | |

Decide y apunta también los **límites** de cada dato de entrada (por ejemplo,
longitud máxima de `title` y de `question`, mínimo y máximo de `limit`). En el
Topic 07 el servidor hará cumplir exactamente esos límites.

### 2. Ejemplos JSON

Escribe, para **crear metadatos de un documento**, una petición de ejemplo, su
respuesta `201` y una respuesta `400` con su `issues`.

### 3. Completa tu `openapi.yaml`

Sobre el `openapi.yaml` que empezaste en la Actividad 01 (o partiendo de la
[plantilla de trabajo](../assets/openapi-skeleton.yaml)):

- cada operación con sus `parameters`, `requestBody` y `responses`
  (éxito y errores de tu tabla);
- los `# TODO` de `components.schemas` rellenos con tus formas y tus
  límites;
- la forma de error `ErrorResponse` de la plantilla, sin cambios.

### 4. Valida y rompe a propósito

```bash
npx @redocly/cli lint openapi.yaml --extends minimal
```

1. Corrige hasta que termine con código 0.
2. Cambia un `$ref` por un nombre que no exista (por ejemplo
   `#/components/schemas/NoExiste`), vuelve a validar y **captura el error**.
3. Restaura el `$ref` y comprueba que vuelve a validar.

### 5. Comprobación cruzada

Para cada operación, comprueba que tabla, router y OpenAPI dicen lo mismo:

| Operación | Tabla (método + ruta) | Router (`src/routes/*.ts`) | OpenAPI (`paths`) | ¿Coinciden? |
|-----------|-----------------------|----------------------------|-------------------|-------------|
| Formular una pregunta | | | | |
| Listar documentos | | | | |
| Crear metadatos de un documento | | | | |
| Consultar un documento | | | | |
| Actualizar metadatos | | | | |

## Entrega

- La tabla de contratos con los límites.
- Los ejemplos JSON del paso 2.
- Vuestro `openapi.yaml`, la salida de la validación correcta y la captura de
  la rotura deliberada.
- La tabla de comprobación cruzada.
