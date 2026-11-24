# Chuleta de OpenAPI 3.1 — con ejemplos reales

Esta chuleta es una tarjeta de consulta para las actividades del topic.
Todas las piezas se explican con fragmentos del **ejemplo inventado** de la
biblioteca. Hay dos versiones: primero el
[básico, sin `components`](./openapi-basic.yaml), y después el
[mismo contrato con `components`](./openapi-components.yaml). El ejemplo
describe una API que no es la tuya: úsalo para entender la sintaxis y después
documenta **tu** proyecto en **tu** `openapi.yaml`.

> Regla de oro: OpenAPI describe **qué** ofrece la API (rutas, datos, estados).
> No dice **cómo** está implementada. Un documento completo y correcto es tan
> importante como el código que describe.

## 1. Estructura general de un documento

Todo documento OpenAPI 3.1 tiene esta forma. Las claves de primer nivel son
siempre las mismas:

```yaml
openapi: 3.1.0        # (obligatorio) versión de la especificación
info:                 # (obligatorio) qué API es
  title: Biblioteca API — ejemplo básico
  version: 1.0.0
servers:              # dónde vive la API
  - url: http://localhost:3000
tags:                 # agrupaciones para la documentación
  - name: Books
paths:                # (obligatorio) el corazón: rutas y métodos
  ...
components:           # piezas reutilizables (schemas, parameters, responses)
  ...
```

`paths` y `components` no se escriben "a mano al final": primero decides las
rutas y luego factorizas lo repetido dentro de `components`.

## 2. Cabecera: `openapi`, `info`, `servers`, `tags`

| Clave | Para qué sirve | Ejemplo del inventado |
|-------|----------------|-----------------------|
| `openapi` | Versión de la especificación. Este topic usa `3.1.0`. | `openapi: 3.1.0` |
| `info.title` | Nombre visible de la API. | `Biblioteca API — ejemplo básico` |
| `info.version` | Versión **del contrato**, no de Node ni del paquete. | `1.0.0` |
| `servers` | URLs donde se ejecuta la API. En clase, `http://localhost:3000`. | `- url: http://localhost:3000` |
| `tags` | Nombres para agrupar operaciones en la documentación. | `- name: Books` |

```yaml
info:
  title: Biblioteca API — ejemplo básico
  version: 1.0.0
  description: |
    API ficticia de gestión de libros. Existe solo para aprender OpenAPI.
```

## 3. `paths`: ruta, método y operación

Cada **ruta** es una clave dentro de `paths` y empieza por `/`. Dentro de la
ruta, cada **método** (`get`, `post`, `patch`, `put`, `delete`) es una
**operación**:

```yaml
paths:
  /api/v1/books:          # ruta de colección
    get:                  # operación: listar
      operationId: listBooks
      summary: Listar libros
      responses: ...
    post:                 # operación: crear
      operationId: createBook
      summary: Crear un libro
      responses: ...

  /api/v1/books/{bookId}: # ruta de elemento (parámetro entre llaves)
    get:
      operationId: getBook
      responses: ...
```

`operationId` es un nombre único para la operación; `summary` y `description`
son texto para las personas. Ninguno de los dos cambia el comportamiento.

## 4. Parámetros: `path` y `query`

Un parámetro se declara con `name`, `in` (`path` o `query`), `required` y
`schema`:

```yaml
parameters:
  - name: bookId          # identifica el recurso en la URL
    in: path
    required: true        # en path SIEMPRE es true
    schema:
      type: string
      format: uuid
  - name: page            # ajusta CÓMO se consulta
    in: query
    required: false       # los query suelen ser opcionales
    schema:
      type: integer
      minimum: 1
      default: 1
```

- Un parámetro de **path** (`/books/{bookId}`) es obligatorio por definición.
- Un parámetro de **query** (`?page=1&limit=20`) es parte de la consulta, no del
  recurso.
- Si un parámetro se repite en varias operaciones de la misma ruta, se declara
  **una vez a nivel de ruta**:

```yaml
/api/v1/books/{bookId}:
  parameters:
    - $ref: '#/components/parameters/BookId'   # lo heredan get y patch
  get: ...
  patch: ...
```

## 5. `requestBody`: los datos que se envían

El cuerpo solo existe en métodos que envían datos (`post`, `patch`, `put`). Se
declara el tipo de contenido y el esquema:

```yaml
requestBody:
  required: true
  content:
    application/json:                 # el endpoint SOLO acepta JSON
      schema:
        $ref: '#/components/schemas/CreateBookRequest'
      examples:                       # opcional, pero muy útil
        valid:
          summary: Libro válido
          value:
            title: El Quijote
            author: Miguel de Cervantes
            year: 1605
```

Regla del topic: **ningún dato puede estar en dos sitios**. Si `bookId` ya está
en el path, no se repite en el body.

## 6. `responses`: qué devuelve cada estado

Cada código de estado documentado es una **clave entre comillas**:

```yaml
responses:
  '200':
    description: Libro encontrado
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Book'
  '400':
    $ref: '#/components/responses/BadRequest'   # error reutilizable
  '404':
    $ref: '#/components/responses/NotFound'
```

- `description` es obligatoria en cada respuesta.
- El **éxito** de una operación es un único código: `200` para consultar o
  actualizar, `201` para crear.
- Los **errores** se documentan por código: `400`, `404`, `500`.

## 7. `components` y `$ref`: describir una regla una sola vez

`components` guarda piezas reutilizables. Se enlazan con `$ref` usando una ruta
interna que empieza por `#/components/...`:

```yaml
components:
  schemas:      # formas JSON  -> #/components/schemas/Nombre
    Book: ...
  parameters:   # parámetros   -> #/components/parameters/Nombre
    BookId: ...
  responses:    # respuestas   -> #/components/responses/Nombre
    NotFound: ...
```

```yaml
schema:
  $ref: '#/components/schemas/Book'
```

Ventaja: si cambia una regla (por ejemplo, el máximo de `title`), se cambia en
un solo sitio y todas las operaciones quedan coherentes.

## 8. Tipos y reglas: de la idea al `schema`

| Quieres exigir... | En OpenAPI | En zod (implementación) | Ejemplo |
|-------------------|------------|-------------------------|---------|
| Texto | `type: string` | `z.string()` | `"El Quijote"` |
| Longitud máxima / mínima | `maxLength` / `minLength` | `.max()` / `.min()` | `maxLength: 120` |
| Al menos un carácter no espacio | `pattern: \S` | `.trim().min(1)` | `"hola"` sí, `"   "` no |
| Entero | `type: integer` | `z.coerce.number().int()` | `1605` |
| Rango | `minimum` / `maximum` | `.min()` / `.max()` | `minimum: 1450` |
| Conjunto cerrado | `enum: [a, b]` | `z.enum(['a', 'b'])` | `enum: [draft]` |
| UUID | `type: string` + `format: uuid` | `.uuid()` | `11111111-...` |
| Fecha y hora | `type: string` + `format: date-time` | `z.string().datetime()` | `2026-01-15T10:00:00.000Z` |
| Booleano | `type: boolean` | `z.boolean()` | `true` |
| Valor por defecto | `default` | `.default()` | `default: 20` |
| Solo lectura (respuesta) | `readOnly: true` | — | `id`, `createdAt` |

### Objetos

```yaml
CreateBookRequest:
  type: object
  required: [title, author, year]     # claves que deben venir
  additionalProperties: false         # rechaza claves desconocidas
  properties:
    title:
      type: string
      minLength: 1
      maxLength: 120
    year:
      type: integer
      minimum: 1450
      maximum: 2100
```

- `required` lista claves **obligatorias**; el resto son opcionales.
- `additionalProperties: false` en entradas equivale a rechazar campos extra.
- `minProperties: 1` en un `PATCH` evita que un cuerpo `{}` pase como válido.

### Arrays

```yaml
citations:
  type: array
  items:
    $ref: '#/components/schemas/Citation'   # forma de CADA elemento
```

### Envoltorios (patrón del proyecto)

Las respuestas de éxito del proyecto van dentro de `data`:

```yaml
BookPage:
  type: object
  required: [data, pagination]
  properties:
    data:
      type: array
      items:
        $ref: '#/components/schemas/Book'
    pagination:
      $ref: '#/components/schemas/Pagination'
```

### Error (patrón del proyecto)

Es la forma `{ error, message }` que ya responde vuestro `errorHandler` del
Topic 05. Los errores de validación añaden `issues` (lo implementa el
middleware `validate` del Topic 07):

```yaml
ErrorResponse:
  type: object
  required: [error, message]
  properties:
    error:
      type: string
      enum: [VALIDATION_ERROR, INVALID_JSON, NOT_FOUND, INTERNAL_ERROR]
    message:
      type: string
    issues:                     # solo en errores de validación
      type: array
      items:
        $ref: '#/components/schemas/ValidationIssue'

ValidationIssue:
  type: object
  required: [location, path, message]
  properties:
    location:
      type: string
      enum: [body, params, query]
    path:
      type: array               # p. ej. ["title"]
      items:
        type: [string, integer]
    message:
      type: string
```

```json
{
  "error": "VALIDATION_ERROR",
  "message": "La solicitud contiene datos no válidos.",
  "issues": [
    { "location": "body", "path": ["title"], "message": "String must contain at least 1 character(s)" }
  ]
}
```

## 9. Extensiones `x-`: anotaciones propias

Una clave que empieza por `x-` es una **extensión**: no forma parte del
estándar, pero las herramientas la ignoran sin romperse. Por ejemplo, para
anotar que el servidor quita los espacios sobrantes del título:

```yaml
title:
  type: string
  minLength: 1
  maxLength: 120
  pattern: \S
  x-normalization: trim-after-length-validation   # nota propia del proyecto
```

No son obligatorias. Si las usas, añade un comentario que explique su
significado.

## 10. Errores frecuentes al escribir OpenAPI

| Síntoma / error | Causa | Solución |
|-----------------|-------|----------|
| El parser dice que el YAML no es válido | Indentación incorrecta (OpenAPI es sensible a espacios) | Usa siempre espacios (2), nunca tabuladores |
| `Missing ...` o un `$ref` no resuelve | La ruta del `$ref` no coincide con `components` | Copia el nombre exacto: `#/components/schemas/Book` |
| Un código de estado no se reconoce | Se escribió sin comillas (`200`) y el parser lo lee como número | Escríbelo entre comillas: `'200'` |
| Falta `requestBody` en un POST/PATCH | Se declaró el `schema` pero sin `content.application/json` | Envuelve el esquema en `content` |
| El validador avisa de una operación sin `responses` | Operación incompleta | Toda operación debe declarar al menos una respuesta |
| Un campo válido se rechaza en la herramienta | Se puso `additionalProperties: false` en una **respuesta** | Reserva `false` para las **entradas** |

## 11. Validar el documento

No basta con que el YAML "se vea bien". Pásale una herramienta:

```bash
# Validación estructural (la que usamos en este topic)
npx @redocly/cli lint openapi.yaml --extends minimal

# Genera documentación HTML navegable en el navegador
npx @redocly/cli build-docs openapi.yaml -o preview.html
```

Empezamos con el ruleset `minimal` porque comprueba lo esencial (que el
documento es OpenAPI 3.1 válido y que los `$ref` resuelven) sin exigir cosas
que todavía no tocan. El ruleset `recommended` (el que se aplica si no pasas
`--extends`) es más estricto: por ejemplo, pide que la API declare cómo se
protege con `security`, algo que en este proyecto llega en el Topic 13. Cuando
lo veas, no es un error tuyo: es una norma de estilo que aplicaremos más
adelante.

```bash
# Más estricto, para cuando quieras pulir el documento
npx @redocly/cli lint openapi.yaml --extends recommended
```

El comando devuelve código 0 y `Woohoo! Your API description is valid` cuando
todo está correcto, y lista cada problema con su fichero y línea cuando no lo
está. La Actividad 02 te pide capturar la validación correcta de tu documento
y el error de una rotura deliberada.
