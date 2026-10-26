# Código de referencia — Topic 04

Proyecto Express que demuestra la definición de **rutas y verbos HTTP** con la
implementación más simple posible: un `Router` por recurso, la lógica en la
propia ruta y los datos en un array en memoria.

Parte **exactamente** del proyecto del Topic 03 (misma factoría, mismo
`server.ts`, misma configuración de ESLint y Prettier) y solo añade un router.
Usa un recurso de práctica, `articles`, con la misma forma que un documento de
Connectia (`id`, `title`, `description`, `createdAt`): la arquitectura es la
que tendrá vuestro backend, pero los endpoints de Connectia (`documents` y
`questions`) los construye cada equipo en las actividades.

```
src/
├── app.ts               # createApp(): monta /health y /api/v1/articles
├── server.ts            # arranque (createApp() + listen), igual que en el Topic 03
├── config/
│   └── env.ts           # carga del .env y valores por defecto (Topic 03)
└── routes/
    ├── health.ts        # GET /health/live (Topic 03, sin cambios)
    └── articles.ts      # NUEVO: lista paginada, crear, consultar y editar
```

> **Sin capas ni middleware propio**: no hay controladores, servicios ni
> middlewares propios. Eso llega en el Topic 05.

## Ejecutarlo

```bash
cd topics/topic-04-UT4-express-routes/code/backend
cp .env.example .env
npm install
npm run dev
```

En otra terminal:

```bash
# Health (200) — sigue funcionando desde el Topic 03
curl -i http://localhost:3000/health/live

# Lista (200)
curl -i http://localhost:3000/api/v1/articles

# Crear (201)
curl -i -X POST http://localhost:3000/api/v1/articles \
  -H 'Content-Type: application/json' \
  -d '{"title":"Primer artículo","description":"Ejemplo"}'

# Lista paginada (200)
curl -i 'http://localhost:3000/api/v1/articles?page=1&limit=1'

# Crear sin título (400)
curl -i -X POST http://localhost:3000/api/v1/articles \
  -H 'Content-Type: application/json' \
  -d '{}'

# Elemento inexistente (404)
curl -i http://localhost:3000/api/v1/articles/no-existe

# Editar (200) — usa el id que devolvió el POST
curl -i -X PATCH http://localhost:3000/api/v1/articles/<id> \
  -H 'Content-Type: application/json' \
  -d '{"title":"Título nuevo"}'
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `dev` | Arranca con recarga (`tsx watch`) |
| `build` | Compila `src/` a `dist/` |
| `start` | Ejecuta el JavaScript compilado |
| `typecheck` | Comprueba tipos sin emitir |
| `lint` | Ejecuta ESLint |
| `format` | Formatea el código con Prettier |
| `format:check` | Verifica el formato sin modificar |
