# Actividad 01 — Del caso de uso al recurso y la ruta

## Objetivo

Convertir los **casos de uso** de nuestra API en **recursos** y **rutas**, y adaptarla a un documento OpenAPI.


## Para qué sirve esta actividad

Antes de escribir la primera ruta hay que responder a una pregunta: *¿sobre qué opera esta API?*

Para ello tenemos dos tipos de elementos:
-  **Recursos**: Se escriben en sustantivo y representan *lo que la API ofrece* (libros, documentos, preguntas...).
- **Rutas**: Representan *dónde se encuentra cada recurso* (`/api/v1/books`, `/api/v1/questions`...).

> Toda esta actividad usa como ejemplo una **API inventada de biblioteca**
> ([`assets/openapi-basic.yaml`](../assets/openapi-basic.yaml); al final del
> topic verás la versión más compleja con
> [`components`](../assets/openapi-components.yaml)).

> Estos archivos son un **ejemplo de OpenAPI**: el
> patrón que vas a copiar **en forma** para luego crear tu propia documentación. También puedes consultar la [chuleta de OpenAPI](../assets/openapi-cheatsheet.md) que he hecho para ti.

## Apuntes 1: Qué es un caso de uso (verbo) y qué es un recurso (sustantivo)

- Un **caso de uso** es una acción de tu dominio: "listar libros", "crear un
  libro", "consultar un libro", "actualizar un libro". Se describen con **verbos**.
- Un **recurso** es un sustantivo: "libro", "documento", "pregunta". Es *aquello* sobre lo que se actúa.

REST reparte el trabajo así: **la ruta nombra el recurso (sustantivo) y el
método HTTP aporta la acción (verbo)**. El verbo nunca se escribe en la URL.

| Caso de uso (verbo) | Recurso (sustantivo) | Método | Ruta resultante 
|---------------------|----------------------|--------|-----------------|
| Consultar la lista de libros | Book | `GET` | `/api/v1/books` |
| Crear un libro | Book | `POST` | `/api/v1/books` |
| Consultar un libro concreto | Book | `GET` | `/api/v1/books/{bookId}` |
| Cambiar parte de un libro | Book | `PATCH` | `/api/v1/books/{bookId}` |

| Método | Significado | Sustituye al verbo |
|--------|-------------|--------------------|
| `GET` | consultar (una lista o un elemento) | *leer* |
| `POST` | crear o procesar | *crear* |
| `PATCH` | modificar parte de un recurso | *modificar* |

## Apuntes 2: Dos tipos de rutas: colección y elemento

- **Ruta de colección (varios elementos)** — Es la ruta que representa la lista del recurso o la creación de un elemento nuevo: `/api/v1/books`, `/api/v1/admin/documents`.
- **Ruta de elemento (un elemento)** — representa un recurso **concreto**, identificado por
  un parámetro de ruta entre llaves: `/api/v1/books/{bookId}`,
  `/api/v1/admin/documents/{documentId}`. Ejemplo: si quieres consultar un libro concreto, necesitas su `bookId` para construir la URL. 'El Quijote' es un libro concreto, y su `bookId` es `21`. Entonces su ruta de elemento es `/api/v1/books/21`.

Regla para decidir:

> Si hablo de **todos** (o de "crear uno nuevo"), es ruta de colección; si hablo
> de **uno en concreto**, es ruta de elemento con su identificador.

El **razonamiento** que vas a escribir en la tabla es justo esto: la frase
que aplica esta regla al caso concreto ("es una consulta sobre la colección;
`GET` no modifica nada"). No es una opinión, es la justificación de por qué
elegiste colección o elemento.

Fíjate en que un mismo recurso tiene **las dos rutas**: `/api/v1/books` (la
colección) y `/api/v1/books/{bookId}` (un elemento). El parámetro se llama
siempre `nombreDelRecursoId` (`bookId`, `documentId`), nunca `id` a secas:
así, cuando la URL aparece dentro de una función, se entiende qué identifica.

## Apuntes 3: Tu mapa es la sección `paths` de un documento OpenAPI

**OpenAPI** es una convención estándar para describir una API HTTP en un fichero
(normalmente YAML). ¿Por qué utilizamos una convención? Porque al ser una convención a nivel mundial, muchos programas pueden leerla y generar documentación, clientes, tests, etc. automáticamente y desarrolladores de diferentes empresas, tecnologías y lenguajes de programación pueden trabajar con ella sin problema.

Esta convención se llamaba **Swagger** hasta 2016; hoy "Swagger" es el nombre
de las herramientas (Swagger UI, Swagger Editor) y la convención es
**OpenAPI**. Este topic usa **OpenAPI 3.1**.

La conexión con lo que acabas de hacer es directa: **cada fila de tu tabla es
una clave dentro de `paths` y un método dentro de ella**. Mira cómo se escribe
el mapa de la biblioteca inventada:

```yaml
paths:
  /api/v1/books:              # ruta de colección
    get:                      # listar libros
      operationId: listBooks
      summary: Listar libros
    post:                     # crear un libro
      operationId: createBook
      summary: Crear un libro

  /api/v1/books/{bookId}:     # ruta de elemento (parámetro entre llaves)
    get:                      # consultar un libro
      operationId: getBook
      summary: Consultar un libro
    patch:                    # actualizar parte de un libro
      operationId: updateBook
      summary: Actualizar parte de un libro
```

Un documento completo añade, antes de `paths`, una pequeña cabecera:

```yaml
openapi: 3.1.0               # versión de la especificación (obligatorio)
info:
  title: Biblioteca API (ejemplo inventado)
  version: 1.0.0
servers:
  - url: http://localhost:3000
tags:
  - name: Books
paths:                       # aquí va tu mapa de recursos
  ...
```

- `openapi`, `info` y `servers` forman la cabecera: versión, nombre y dónde
  vive la API.
- `paths` es tu tabla convertida en YAML: ruta → método → operación.
- `operationId` es un nombre único por operación; `summary` es texto legible.

Por ahora **solo escribimos la estructura de `paths`** (rutas, métodos,
`operationId`, `summary`). Los datos, los esquemas y las respuestas se añaden
en las actividades 02 y 03. Es normal que el documento todavía esté
incompleto.


## Ejemplo completo y sencillo: API de libros

Vuelve al ejemplo inventado de biblioteca, pero esta vez viendo **las cuatro
operaciones juntas**, en su versión más simple (sin comentarios, sin
`components`, solo la forma final):

| Caso de uso | Recurso | Método | Ruta | Qué hace |
|---|---|---|---|---|
| Listar libros | Book | `GET` | `/api/v1/books` | Devuelve una página de libros, con `page` y `limit` opcionales. |
| Crear un libro | Book | `POST` | `/api/v1/books` | Crea un libro nuevo y devuelve el recurso creado con su `id`. |
| Consultar un libro | Book | `GET` | `/api/v1/books/{bookId}` | Devuelve un libro por su id, o `404` si no existe. |
| Actualizar un libro | Book | `PATCH` | `/api/v1/books/{bookId}` | Actualiza solo los campos enviados; un body vacío no es válido. |

Y la misma tabla, como la sección `paths` de un documento OpenAPI:

```yaml
paths:
  /api/v1/books:
    get:
      operationId: listBooks
      summary: Listar libros
    post:
      operationId: createBook
      summary: Crear un libro

  /api/v1/books/{bookId}:
    get:
      operationId: getBook
      summary: Consultar un libro
    patch:
      operationId: updateBook
      summary: Actualizar un libro
```

Esto es exactamente el mismo `paths` que viste en el Apunte 3, con las cuatro
operaciones juntas en vez de dos. La versión completa y comentada, ya con
`$ref`, está en
[`assets/openapi-components.yaml`](../assets/openapi-components.yaml); esta es
la versión "de bolsillo" para copiar el patrón rápido.

## EJERCICIO: Tu propio mapa de recursos y rutas OpenAPI

Intenta hacer ahora lo mismo pero con el backend que estás construyendo: los cinco
endpoints de la tabla "Los endpoints de tu backend..." que te muestro a continuación: 


| Caso de uso | Recurso | Método | Ruta | Qué hace |
|---|---|---|---|---|
| Formular una pregunta | Question | `POST` | `/api/v1/questions` | Recibe una pregunta y devuelve una respuesta simulada con citas fijas (mock determinista; no hay IA real todavía). |
| Listar documentos | Document | `GET` | `/api/v1/admin/documents` | Devuelve una página de metadatos de documentos (`page`, `limit`), sin ficheros ni contenido. |
| Crear metadatos de un documento | Document | `POST` | `/api/v1/admin/documents` | Crea un documento **solo en memoria**: sin subida de fichero, sin versiones (eso llega en topics posteriores). |
| Consultar un documento | Document | `GET` | `/api/v1/admin/documents/{documentId}` | Devuelve un documento por su id, o `404` si el id es válido pero no existe. |
| Actualizar metadatos | Document | `PATCH` | `/api/v1/admin/documents/{documentId}` | Actualiza solo los campos enviados en el body; un body vacío no es una petición válida. |

Crea tu propio documento OpenAPI con la misma estructura que el ejemplo de libros, pero con tus cinco endpoints. De manera similar a la tabla de ejemplo anterior.

> **Dónde**: en la raíz del **repositorio de tu backend**, como
> `openapi.yaml` (junto a `package.json`). Puedes partir de la
> [plantilla de trabajo](../assets/openapi-skeleton.yaml): por ahora rellena
> solo la cabecera y las claves de `paths` con su `operationId` y `summary`.
> En la Actividad 02 completarás el resto.

Comprueba que cada ruta de tu `paths` existe en tus routers
(`src/routes/documents.ts` y `src/routes/questions.ts`) con el mismo método.