# Topic 05 — Syllabus

- Ciclo de vida de una petición en Express (middleware → ruta → respuesta).
- Routers modulares con `express.Router()` que solo conectan URL → controlador,
  y separación rutas → controladores → servicios.
- Middleware personalizado (requestId, logger) y logging estructurado.
- Manejador de rutas no encontradas (404) y manejador centralizado de errores
  (4 parámetros), incluido el JSON mal formado (400).
- `AppError` y contrato de respuesta de error (`{ error, message }`).
- Verificar manualmente los caminos de error (400, 404, 500).
