# Código de referencia — Topic 06

Es el **mismo proyecto del Topic 05** (recurso de práctica `articles` en
rutas → controladores → servicios, middlewares y `errorHandler`) más lo que
añade este topic: su contrato **`openapi.yaml`** en la raíz.

> **Ejemplo de estudio, no la entrega.** Tiene la arquitectura y las carpetas
> que tendrá vuestro backend, pero describe `articles`, no vuestros
> `questions` y `admin/documents`. Vuestro `openapi.yaml` lo escribís en las
> actividades, a partir de la plantilla
> [`../assets/openapi-skeleton.yaml`](../assets/openapi-skeleton.yaml).

> **Contrato, no validación.** El contrato declara qué es válido (límites,
> campos obligatorios, `400` con `issues`), pero el código todavía no lo hace
> cumplir: las comprobaciones siguen siendo las de a mano del Topic 05 y
> responden `BAD_REQUEST`. En el Topic 07, `zod` y el middleware `validate`
> hacen que el servidor cumpla el contrato (`VALIDATION_ERROR` con `issues`).

## Comandos

```bash
cd topics/topic-06-UT8-rest-openapi/code/backend
cp .env.example .env
npm install
npm run typecheck
npx @redocly/cli lint openapi.yaml --extends minimal
npm run dev
```

| Comando | Para qué |
|---------|----------|
| `npm run dev` | Arranca con recarga |
| `npm run typecheck` | Comprueba tipos en estricto |
| `npm run lint` | ESLint |
| `npm run format:check` | Comprueba el formato con Prettier |
| `npx @redocly/cli lint openapi.yaml --extends minimal` | Valida el contrato (el mismo comando que usáis para el vuestro) |

## Estructura

```text
openapi.yaml               # NUEVO en este topic: el contrato HTTP
src/
├── app.ts                 # createApp(): middlewares y routers
├── server.ts              # entorno y listen()
├── config/env.ts          # .env + valores por defecto
├── controllers/           # traducción HTTP (req/res)
├── errors/AppError.ts     # error esperado con statusCode y code
├── middlewares/           # requestId, logger, notFound, errorHandler
├── routes/                # health.ts y articles.ts: URL → controlador
└── services/              # lógica y datos en memoria, sin Express
```

## Contrato y comportamiento, lado a lado

```bash
npm run dev
```

```bash
# 201 — coincide con CreateArticleRequest → ArticleEnvelope
curl -i -X POST http://localhost:3000/api/v1/articles \
  -H 'Content-Type: application/json' \
  -d '{"title":"Primer artículo","description":"Ejemplo"}'

# 200 — coincide con ArticleListResponse (data + pagination)
curl -i 'http://localhost:3000/api/v1/articles?page=1&limit=20'

# 404 — coincide con NotFound
curl -i http://localhost:3000/api/v1/articles/99999999-9999-4999-8999-999999999999

# 400 — el contrato dice VALIDATION_ERROR con issues; el código aún responde
# BAD_REQUEST: es la diferencia que cierra el Topic 07
curl -i -X POST http://localhost:3000/api/v1/articles \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Más ejemplos en [`../assets/requests.http`](../assets/requests.http).
Los artículos viven en memoria: reinicia `npm run dev` para vaciarlos.
