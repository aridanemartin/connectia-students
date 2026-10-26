# Topic 04 — Syllabus

- Verbos HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) y cuándo usar cada uno.
- Definir rutas en un `Router` por recurso (`router.get/post/patch(path, handler)`)
  y montarlo en `createApp()` con `app.use(prefijo, router)`, sin tocar el
  router de health ni `server.ts`.
- Leer datos de la petición: `req.params`, `req.query` y `req.body`.
- Elegir el código de estado correcto (`200`, `201`, `204`, `400`, `404`).
- Implementar un CRUD en memoria en Express, sin capas ni middleware propio.
- Probar endpoints con `curl` y Bruno.
