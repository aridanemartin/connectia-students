# Código de referencia — Topic 04

Proyecto Express mínimo que demuestra la definición de **rutas y verbos HTTP**
con la implementación más simple posible: lógica en la propia ruta y datos en
un array en memoria.

- `src/app.ts` — los cinco endpoints de Connectia, directamente sobre `app`.
- `src/server.ts` — arranque (importa `app` y escucha).
- `src/config/env.ts` — carga del `.env` y `PORT`.

> **Sin capas ni middleware**: no hay controladores, servicios ni middlewares
> propios. Eso llega en el Topic 05. Este ejemplo es el punto de partida.

## Ejecutarlo

```bash
cd topics/topic-04-UT4-express-routes/code/backend
cp .env.example .env
npm install
npm run dev
```

En otra terminal:

```bash
# Lista (200)
curl -i http://localhost:3000/api/v1/admin/documents

# Crear (201)
curl -i -X POST http://localhost:3000/api/v1/admin/documents \
  -H 'Content-Type: application/json' \
  -d '{"title":"Normas de convivencia"}'

# Elemento inexistente (404)
curl -i http://localhost:3000/api/v1/admin/documents/no-existe

# Pregunta (200)
curl -i -X POST http://localhost:3000/api/v1/questions \
  -H 'Content-Type: application/json' \
  -d '{"question":"¿Cuál es el horario de atención?"}'
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `dev` | Arranca con recarga (`tsx watch`) |
| `build` | Compila `src/` a `dist/` |
| `start` | Ejecuta el JavaScript compilado |
| `typecheck` | Comprueba tipos sin emitir |
