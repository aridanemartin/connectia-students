# Código de referencia — Topic 05

Este directorio contiene el proyecto Express de referencia que demuestra los conceptos
de la Topic 05: middleware personalizado, separación en tres capas
(rutas → controladores → servicios), manejo de errores y logging estructurado.

Es el proyecto del Topic 04 refactorizado: misma factoría `createApp()`, mismo
`server.ts`, mismo `GET /health/live` y el mismo recurso de práctica
`articles`, ahora repartido en capas. Tiene la arquitectura y las carpetas que
tendrá vuestro backend al terminar el topic; vuestros `documents` y
`questions` los construís vosotros en las actividades.

## Requisitos

- Node.js ≥ 20.19
- npm ≥ 9

## Instalación

```bash
cd code/backend
cp .env.example .env
npm install
```

## Scripts disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| dev | `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática |
| build | `npm run build` | Compila TypeScript a JavaScript en `dist/` |
| start | `npm start` | Ejecuta el JavaScript compilado (requiere `build` primero) |
| typecheck | `npm run typecheck` | Verifica tipos sin compilar |
| lint | `npm run lint` | Ejecuta ESLint |
| format | `npm run format` | Formatea el código con Prettier |
| format:check | `npm run format:check` | Verifica el formato sin modificar |

## Verificación

Inicia el servidor:

```bash
npm run dev
```

### Rutas de la API

```bash
# Health check
curl http://localhost:3000/health/live

# Listar artículos (paginado)
curl 'http://localhost:3000/api/v1/articles?page=1&limit=20'

# Crear artículo
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primer artículo"}'

# Obtener artículo por ID
curl http://localhost:3000/api/v1/articles/<id>

# Editar artículo
curl -X PATCH http://localhost:3000/api/v1/articles/<id> \
  -H "Content-Type: application/json" \
  -d '{"description": "Nueva descripción"}'
```

### Verificación de errores

```bash
# 404 — ruta no encontrada
curl http://localhost:3000/nonexistent

# 404 — artículo que no existe
curl http://localhost:3000/api/v1/articles/no-existe

# 400 — body sin título
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{}'

# 400 — body que no es JSON válido
curl -X POST http://localhost:3000/api/v1/articles \
  -H "Content-Type: application/json" \
  -d '{malo'
```

## Estructura del proyecto

```
src/
├── app.ts                            # createApp(): middlewares y routers en orden
├── server.ts                         # Punto de entrada (listen)
├── config/
│   └── env.ts                        # Config de entorno (loadEnvFile + defaults)
├── middlewares/
│   ├── requestId.ts                  # Asigna UUID a cada petición
│   ├── logger.ts                     # Logging estructurado en JSON
│   ├── notFound.ts                   # Manejador 404
│   └── errorHandler.ts               # Manejador centralizado de errores (4 parámetros)
├── errors/
│   └── AppError.ts                   # Error personalizado con statusCode y code
├── routes/
│   ├── health.ts                     # GET /health/live (Topic 03)
│   └── articles.ts                   # URL → controlador
├── controllers/
│   └── articlesController.ts         # req/res, validación a mano, AppError
└── services/
    └── articlesService.ts            # Array en memoria (sin Express)
```

En vuestro backend, junto a `health.ts` estarán `documents.ts` y
`questions.ts`, con sus controladores y servicios.
