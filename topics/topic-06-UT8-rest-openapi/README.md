# Topic 06 — Diseño de API REST y OpenAPI

Este topic es de **diseño de contrato HTTP**. Antes de implementar lógica,
decidimos *qué* ofrece la API: recursos, rutas, métodos, estados y formas JSON.
El resultado es un documento **OpenAPI 3.1** validado que cualquier persona o
herramienta puede leer.

> **Validación en ejecución**: en este topic el contrato *declara* qué es
> válido y qué no (qué `400` existe, qué forma tiene un error), pero **no**
> implementamos la comprobación con código. Eso es el **Topic 07** (`zod`).
> Aquí decidimos el contrato; en el 07 lo hacemos cumplir.

> **Idioma**: las explicaciones pedagógicas están en español. Los
> identificadores técnicos (`GET`, `paths`, `components`, `openapi`, etc.) van
> en inglés.

## Objetivos de aprendizaje

Al finalizar este topic serás capaz de:

- Modelar **recursos** y diseñar rutas orientadas a sustantivos.
- Elegir el **método HTTP** y el **código de estado** justificando su semántica.
- Distinguir qué dato va en `path`, en `query` y en `body`, sin duplicarlo.
- Definir contratos JSON de petición, respuesta y **error**.
- Escribir un documento **OpenAPI 3.1** con `paths`, `parameters`,
  `requestBody`, `responses` y `components`.
- Validar el documento con una herramienta y detectar una rotura deliberada.
- Comprobar que documento, router y comportamiento observado dicen lo mismo.

## Prerrequisitos

- **Topic 05**: arquitectura por capas (`routes → controllers → services`)
  aplicada a `documents` y `questions`, middleware y manejador centralizado de
  errores que responde `{ error, message }`.
- **Topic 03**: Node.js ≥ 20.19, TypeScript estricto y `npm run typecheck`.

La **implementación** de la validación (esquemas `zod`, middleware `validate`,
entorno fail-fast) se estudia en el **Topic 07**; aquí solo diseñamos el
contrato que esa implementación deberá cumplir.

## Conceptos del topic

### Recurso y ruta

Un **recurso** es aquello sobre lo que opera la API: una pregunta pública o un
documento administrativo individual. La ruta representa el recurso con
sustantivos:

```text
/api/v1/questions
/api/v1/admin/documents
/api/v1/admin/documents/{documentId}
```

Evita rutas como `/createDocument` o `/getQuestion`. La acción ya está
representada por el método HTTP.

### Métodos HTTP

| Método | Uso este topic | Propiedad importante |
|--------|-----------------|-----------------------|
| `GET` | Consultar una lista o un elemento | No crea ni modifica recursos |
| `POST` | Crear o procesar un nuevo dato | El servidor decide el resultado o identificador |
| `PATCH` | Modificar parte de un recurso | Solo envía los campos que cambian |

### Códigos de estado

| Estado | Cuándo se usa |
|--------|---------------|
| `200 OK` | Consulta, actualización o pregunta procesada correctamente |
| `201 Created` | Se han creado metadatos de documento |
| `400 Bad Request` | La entrada no cumple el contrato |
| `404 Not Found` | La ruta o un identificador válido no corresponde a un recurso |
| `500 Internal Server Error` | Ocurre un fallo inesperado y se responde sin filtrar detalles |

Un UUID mal escrito produce `400`: el cliente no respetó el contrato. Un UUID
bien formado que no existe produce `404`: la forma era válida, pero no hay
recurso. **El contrato declara ambos**; quién los hace cumplir se implementa en
el Topic 07.

### `path`, `query` y `body`

```http
PATCH /api/v1/admin/documents/11111111-1111-4111-8111-111111111111
Content-Type: application/json

{"title":"Guía revisada"}
```

- **Path parameter**: identifica el recurso concreto:
  `documentId=11111111-...`.
- **Query parameter**: ajusta una consulta, filtro o paginación. Por ejemplo:
  `GET /api/v1/admin/documents?page=1`.
- **Request body**: contiene la representación que se crea o modifica:
  `{"title":"Guía revisada"}`.

No dupliques el mismo dato en dos lugares. Si identifica el recurso, va en la
ruta; si modifica cómo se consulta, va en `query`; si describe datos que se
procesan o cambian, va en `body`.

### Contrato de error

Toda respuesta de error sigue el formato `{ error, message }` que ya produce
vuestro `errorHandler` del Topic 05. Los errores de validación añaden la
lista `issues`:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "La solicitud contiene datos no válidos.",
  "issues": [
    {
      "location": "body",
      "path": ["question"],
      "message": "String must contain at least 1 character(s)"
    }
  ]
}
```

El contrato **documenta** esta envoltura completa. Hoy vuestras comprobaciones
a mano responden `BAD_REQUEST` sin `issues`; el middleware `validate` que
produce `VALIDATION_ERROR` con `issues` se implementa en el Topic 07.

### OpenAPI

[OpenAPI](./code/backend/openapi.yaml) es una descripción legible por personas
y herramientas. Las secciones de este topic son:

- `openapi`: versión de la especificación;
- `info`: nombre y versión de nuestra API;
- `servers`: entorno de ejemplo;
- `paths`: métodos y rutas;
- `parameters`: datos de `path` o `query`;
- `requestBody`: cuerpo y tipo de contenido;
- `responses`: estados y cuerpos posibles; y
- `components.schemas`: formas JSON reutilizables.

Para practicar la sintaxis sin tocar tu entrega, el topic incluye **dos
contratos de ejemplo de otro dominio** (una API de biblioteca inventada),
progresivos:

1. [`assets/openapi-basic.yaml`](./assets/openapi-basic.yaml) — el **primer
   contacto**: todo escrito "en su sitio", **sin `components`**.
2. [`assets/openapi-components.yaml`](./assets/openapi-components.yaml) — el
   **mismo contrato**, con lo reutilizable en `components` y enlazado con
   `$ref`.

Léelos en ese orden, previsualízalos, rómpelos y solo después escribe el
contrato de tu proyecto. La sintaxis pieza a pieza está en la
[chuleta de OpenAPI](./assets/openapi-cheatsheet.md), y la
[plantilla de trabajo](./assets/openapi-skeleton.yaml) te da el esqueleto de tu
propio contrato con los huecos marcados (`# TODO`).

Todo contrato debe **validarse**: en este topic se usa
`npx @redocly/cli lint openapi.yaml --extends minimal`.

## Ejemplo guiado

> ### Cómo se usa el código de este topic
>
> La carpeta [`code/`](./code/) es el **proyecto de referencia** del
> Topic 05 (recurso de práctica `articles`) con su `openapi.yaml`. Tiene la
> misma arquitectura y las mismas carpetas que vuestro backend, pero **no es
> tu entrega y no debes copiarla**: vuestro contrato describe `questions` y
> `admin/documents`.
>
> - Tu entrega vive en el **repositorio de tu equipo**: un `openapi.yaml` en
>   la raíz de vuestro backend.
> - Lo que debes construir está definido en los **ejercicios** de este topic.
> - El código no cambia en este topic: hacer que cumpla el contrato es el
>   **Topic 07**.

### 1. Preparar y verificar el proyecto

```bash
cd topics/topic-06-UT8-rest-openapi/code/backend
cp .env.example .env
npm install
npm run typecheck
npx @redocly/cli lint openapi.yaml --extends minimal
```

Resultado esperado: `Woohoo! Your API description is valid` y código 0.

### 2. Leer el contrato antes de las rutas

Abre [`openapi.yaml`](./code/backend/openapi.yaml) y localiza:

1. `GET` y `POST /api/v1/articles`; y
2. `GET` y `PATCH /api/v1/articles/{articleId}`.

Relaciona cada operación con una fila de esta tabla y con su línea en
`src/routes/articles.ts`:

| Operación | Método y ruta | Entrada | Éxito | Errores principales |
|-----------|---------------|---------|-------|---------------------|
| Listar artículos | `GET /api/v1/articles` | `query.page`, `query.limit` | `200` | `400`, `500` |
| Crear artículo | `POST /api/v1/articles` | `body` | `201` | `400`, `500` |
| Consultar artículo | `GET /api/v1/articles/{articleId}` | `path.articleId` | `200` | `400`, `404`, `500` |
| Actualizar artículo | `PATCH /api/v1/articles/{articleId}` | `path` y `body` | `200` | `400`, `404`, `500` |

Arranca el proyecto (`npm run dev`) y compara contrato y comportamiento: un
`POST` sin título responde `400` con `BAD_REQUEST` y sin `issues`, mientras
que el contrato promete `VALIDATION_ERROR` con `issues`. Esa diferencia es
justo lo que resuelve el Topic 07.

### 3. Romper y restaurar OpenAPI

Cambia temporalmente un `$ref` (por ejemplo
`'#/components/schemas/Article'` por `'#/components/schemas/NoExiste'`) y
ejecuta:

```bash
npx @redocly/cli lint openapi.yaml --extends minimal
```

Debe fallar indicando que no puede resolver el `$ref`. Restaura el valor,
repite el comando y comprueba que vuelve a pasar.

## Actividades del alumnado

Las dos actividades se entregan en el mismo orden. Todas las explicaciones usan
como ejemplo una **API inventada de biblioteca**
([`assets/openapi-basic.yaml`](./assets/openapi-basic.yaml) primero y
[`assets/openapi-components.yaml`](./assets/openapi-components.yaml) después);
tú debes aplicar cada paso a la **API de tu propio proyecto**, no copiar el
ejemplo. Como apoyo tienes la
[chuleta de OpenAPI](./assets/openapi-cheatsheet.md) y la
[plantilla de trabajo](./assets/openapi-skeleton.yaml).

1. **[Del caso de uso al recurso y la ruta](./exercises/01-resource-map.md)**
   - Objetivo: convertir casos de uso en recursos, rutas de colección y rutas
     de elemento, y ver el mapa reflejado en `paths`.
   - Entregable: tabla de recursos de tu API y las claves de `paths` en tu
     `openapi.yaml`.

2. **[El contrato de cada endpoint](./exercises/02-endpoint-contracts.md)**
   - Objetivo: decidir método, ruta, ubicación de cada dato, éxito, errores y
     límites, y escribir el `openapi.yaml` completo.
   - Entregable: tabla de contratos, ejemplos JSON, `openapi.yaml` validado
     (con la captura de una rotura deliberada) y tabla de comprobación
     cruzada.

## Incremento del topic en el proyecto

Cada equipo incorporará a su backend:

- una tabla revisada de recursos y contratos;
- rutas versionadas para la pregunta simulada y documentos administrativos;
- un `openapi.yaml` **propio**, alineado con las rutas y **validado** con
  `npx @redocly/cli lint openapi.yaml --extends minimal`.

No se incorpora base de datos, autenticación funcional, subida de PDF,
versiones, indexación ni integración real de IA. La **implementación de la
validación** (esquemas `zod`, middleware, entorno fail-fast) se trabajará en el
**Topic 07**.

## Criterios de aceptación

- [ ] Las dos actividades están entregadas con sus nombres numerados.
- [ ] Vuestro `openapi.yaml` cubre todas las operaciones del backend.
- [ ] El documento valida con
      `npx @redocly/cli lint openapi.yaml --extends minimal` (código 0).
- [ ] Una rotura deliberada (versión incorrecta o `$ref` inexistente) hace
      fallar al verificador.
- [ ] La tabla de comprobación cruzada relaciona cada operación con tabla,
      router y OpenAPI.
- [ ] La forma de error es `{ error, message, issues? }`, la misma que
      responde el `errorHandler` del Topic 05.
- [ ] No existe persistencia, autenticación implementada, subida de ficheros,
      colección de documentos como concepto de dominio ni código de IA.

## Errores comunes y depuración

- **Usar verbos en la ruta** — Causa: trasladar nombres de funciones a HTTP.
  Cómo depurarlo: subraya el recurso y deja que `GET`, `POST` o `PATCH`
  representen la acción.
- **Confundir forma y existencia** — Causa: responder `404` a todo dato
  incorrecto. Cómo depurarlo: el contrato declara `400` si la forma no es
  válida y `404` solo si la forma es válida pero el recurso no existe.
- **Aceptar propiedades adicionales** — Causa: no declarar
  `additionalProperties: false` en las **entradas** del schema.
- **OpenAPI dice algo distinto al código** — Causa: actualizar solo una
  representación. Cómo depurarlo: compara ruta, método, entrada y estados fila
  por fila; ejecuta el validador.
- **Poner `additionalProperties: false` en una respuesta** — Causa: confundir
  entrada y salida. Reserva `false` para las entradas.
- **Escribir códigos de estado sin comillas** — Causa: YAML los lee como
  número. Escríbelos como `'200'`.

## Resultados de aprendizaje DSW

La referencia oficial
[`references/dsw-learning-outcomes.md`](../../references/dsw-learning-outcomes.md)
todavía no contiene el texto normativo. Por ello se identifica la evidencia
observable, pero **no** se inventa ningún criterio oficial.

| RA | Criterio de evaluación | Evidencia este topic |
|----|------------------------|-----------------------|
| RA7 | `RA7.CE-pending-1` — texto oficial pendiente | Tabla de contratos, `openapi.yaml`, comprobación cruzada y defensa de decisiones REST |

## Autoevaluación

Responde **sí / con dudas / no**:

- ¿Puedo convertir un caso de uso en recurso, método y ruta sin usar verbos en
  la ruta?
- ¿Puedo justificar cuándo usar `200`, `201`, `400` y `404`?
- ¿Puedo decidir si un dato pertenece a `path`, `query` o `body`?
- ¿Puedo escribir una operación completa en OpenAPI 3.1?
- ¿Puedo explicar qué guarda `components` y para qué sirve un `$ref`?
- ¿Puedo validar mi documento y detectar una rotura deliberada?

## Notas de sesión para el profesorado

Guía operativa para impartir el Topic 06. El material para el alumnado está en
las secciones anteriores; los apuntes pedagógicos de cada actividad viven en
sus plantillas de [`exercises/`](./exercises/).

### Propósito y límites

La topic consolida el **contrato HTTP** antes de implementar su cumplimiento.
El alumnado debe salir con decisiones defendibles y verificables, no con una
API «completa». Límites que deben repetirse:

- aquí **se diseña** el contrato; la **validación en ejecución** (`zod`) es el
  Topic 07;
- los documentos existen individualmente y solo en memoria;
- las rutas administrativas necesitarán autenticación en un topic posterior;
- no hay PDF, versiones, indexación ni base de datos; y
- no se implementa lógica de negocio: el foco es el contrato.

### Distribución de las 7 horas

| Bloque | Tiempo | Descripción |
|--------|--------|-------------|
| Instrucción directa | 1 h | Recursos, métodos, estados, `path`/`query`/`body`, contrato de error y OpenAPI |
| Demostración guiada | 1 h | Recorrido contrato → `paths` → `components` → validación OpenAPI |
| Práctica supervisada | 1 h 45 min | Actividad 01 y apuntes de la Actividad 02 |
| Trabajo de proyecto | 2 h | Ejercicio de la Actividad 02: `openapi.yaml` propio y comprobación cruzada |
| Revisión | 45 min | Comparación cruzada tabla / router / OpenAPI y defensa por parejas |
| Evaluación | 30 min | Validación de documentos, muestreo oral y recogida de evidencias |

**Total: 7 horas.**

### Preparación previa

- [ ] Verificar Node.js 20+ y npm en el equipo de demostración.
- [ ] Ejecutar `npm install` dentro de `code/backend/`.
- [ ] Ejecutar `npm run typecheck` y
      `npx @redocly/cli lint openapi.yaml --extends minimal`.
- [ ] Confirmar 4 operaciones OpenAPI (`articles`).
- [ ] Abrir `openapi.yaml` y `src/routes/articles.ts` en pestañas ordenadas.
- [ ] Preparar una copia temporal de `openapi.yaml` con un `$ref` roto para
      el fallo controlado.
- [ ] Preparar copias digitales de las dos actividades.
- [ ] Comprobar que `npx @redocly/cli lint openapi.yaml --extends minimal`
      funciona en el equipo de demostración.

### Guión de demostración

1. **Partir del contrato, no del editor.** Mostrar el caso «una persona hace
   una pregunta pública»; pedir tres propuestas de ruta (anota también una
   mala: `/askQuestion`); separar recurso (`questions`) y acción (`POST`);
   completar en pantalla entrada `body`, éxito `200`, error de validación
   `400`. Repetir con «consultar un documento concreto»: `GET`,
   `/admin/documents/{documentId}`, `200`, `400`, `404`.
2. **Recorrer los `paths` del contrato.** Abrir `openapi.yaml` y relacionar
   cada operación con la tabla.
3. **Diferenciar formato y existencia.** Dibujar dos puertas: ¿formato válido?
   → no → `400`; sí → ¿recurso existe? → no → `404`.
4. **Cruzar comportamiento y OpenAPI.** Ejecutar
   `npx @redocly/cli lint openapi.yaml --extends minimal`. Romper
   temporalmente un `$ref`, repetir y observar el fallo. Restaurar. Después,
   `curl` de un `POST` sin título: el contrato promete `VALIDATION_ERROR` con
   `issues` y el código responde `BAD_REQUEST`; anunciar que el Topic 07 lo
   arregla.
5. **Cierre visible.** Mostrar en pizarra: contract table = intent;
   OpenAPI = machine-readable agreement.

### Conceptos erróneos esperados

- **«REST significa usar JSON»** — JSON es un formato. REST aquí se observa en
  recursos, métodos, rutas y semántica de respuestas.
- **«`POST` siempre devuelve `201`»** — `201` corresponde a creación. Procesar
  una pregunta simulada sin crear un recurso persistente devuelve `200`.
- **«Todo identificador que no funciona es `404`»** — primero se valida la
  forma (`400`); solo un identificador válido ausente produce `404`.
- **«OpenAPI genera automáticamente el comportamiento correcto»** — documenta
  un acuerdo; la revisión detecta diferencias.
- **«Aquí ya se implementa la validación»** — no: aquí se declara el contrato;
  la implementación con `zod` es el Topic 07.
- **«Una lista de documentos es un document set»** — no. Es una representación
  paginada de documentos individuales.

### Diferenciación

- **Apoyo**:
  - Entregar primero solo tres operaciones: pregunta, lista y consulta por ID.
  - Usar tarjetas de color: azul `path`, verde `query`, amarillo `body`.
  - Proporcionar la envoltura de error completa y pedir que rellenen solo
    `location`, `field` y `message`.
- **Extensión**:
  - Añadir un filtro opcional `status=draft` manteniendo tabla, esquema y
    OpenAPI sincronizados.
  - Escribir una comprobación que compare métodos/rutas del router con la
    matriz esperada.

### Evidencias de evaluación (recogida por equipo)

Para RA7:

- [ ] `01-resource-map.md` completo.
- [ ] `02-endpoint-contracts.md` completo y revisado.
- [ ] Vuestro `openapi.yaml` final validado con
      `npx @redocly/cli lint openapi.yaml --extends minimal`.
- [ ] Tabla de comprobación cruzada de la Actividad 02.
- [ ] Captura de la rotura deliberada detectada por el validador.
- [ ] Defensa oral de método, ruta, entrada y estado para una operación.

### Señales de que el grupo está listo para la Topic 07

- todos los equipos tienen un `openapi.yaml` propio que valida;
- la revisión cruzada detecta al menos una discrepancia;
- cada estudiante puede explicar `400` frente a `404`; y
- nadie confunde diseñar el contrato con implementar la validación.
