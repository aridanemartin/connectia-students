# Actividad 04 — Probar con `curl` y Bruno

## Objetivo

Comprobar que cada endpoint responde con el **estado** y el **cuerpo**
esperados, usando `curl` y Bruno.

> **Dónde trabajas**: contra tu backend en marcha (`npm run dev`).

## Apuntes: `curl -i` muestra el estado

```bash
curl -i http://localhost:3000/api/v1/admin/documents
```

La primera línea es el estado (`HTTP/1.1 200 OK`); después, las cabeceras y el
cuerpo. En Bruno, mira el código de estado y la pestaña de respuesta.

## Ejercicio

Ejecuta y captura cada caso:

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

Después replicalas en **Bruno** y compara el resultado con el
de `curl`: debe ser la misma petición.
