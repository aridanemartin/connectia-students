# Primer contacto con `req` y `res` — Actividad 8

## Apuntes: los dos objetos de todo handler

Todas las rutas que habéis escrito en este topic tienen la misma forma:

```ts
healthRouter.get('/live', (_req, res) => {
  res.status(200).json({ status: 'live' });
});
```

¿De dónde salen `_req` y `res`? **No los creáis vosotros**: cuando llega
una petición HTTP, Express la convierte en objetos JavaScript, encuentra
la ruta que coincide y **llama a vuestra función pasándole esos dos
objetos**. La firma `(req, res)` es un contrato: Express promete invocar
tu handler con la petición en el primer parámetro y la respuesta en el
segundo. Podéis nombrarlos como queráis — el `_` delante de `_req` solo
dice "este parámetro no lo uso" (para que el linter no se queje de que hay una variable sin usar).

| Objeto | Qué representa | Qué contiene / permite |
|--------|----------------|------------------------|
| `req` (Request) | La **petición entrante**, ya parseada | `req.method` (`GET`, `POST`...), `req.originalUrl` (la URL completa), `req.headers` (cabeceras), `req.query` (query params), `req.body` (cuerpo, si algún middleware lo parseó) |
| `res` (Response) | La **respuesta saliente**: es vuestra herramienta para contestar | `res.status(código)` fija el código HTTP, `res.json(objeto)` envía JSON, `res.send(texto)` envía texto/HTML |

Una petición HTTP tiene método, ruta, cabeceras y cuerpo; una respuesta
tiene código de estado, cabeceras y cuerpo. **`req` y `res` son eso
mismo**, pero como objetos con los que se puede programar.

> **Regla de oro**: si tu handler nunca escribe en `res` (ni llama a
> `next()`), la conexión se queda **abierta y colgada** hasta que el
> cliente se rinde por timeout. Express no responde por ti: responder es
> trabajo de tu handler, a través de `res`.

## Apuntes: cómo mirar dentro de `req` (y por qué no con `console.log(req)`)

La forma correcta de inspeccionar es **loguear campos concretos**:

```ts
console.log(req.method, req.originalUrl); // p. ej. "GET /health/live"
```

La forma tentadora — `console.log(req)` — es una mala idea por tres
razones:

1. El objeto es **enorme**: incluye cabeceras, el socket TCP, la
   configuración interna de Express... La salida inunda la terminal y
   dentro de ese ruido es más difícil encontrar lo que buscabas.
2. Contiene **referencias circulares**: partes del objeto apuntan entre
   sí, y la salida aparece llena de `[Circular *1]` en lugar de datos.
3. Puede **imprimir secretos**: en `req.headers` viajan cabeceras de
   autenticación, cookies, tokens. Un log así, pegado en un issue o en
   una captura, filtra credenciales.

## Ejercicio 1 — leer de `req` (el primer log del servidor)

1. En `src/routes/health.ts`, renombra `_req` a `req` y añade el log:

   ```ts
   healthRouter.get('/live', (req, res) => {
     console.log(req.method, req.originalUrl); // TEMPORAL: se quita al final
     res.status(200).json({ status: 'live' });
   });
   ```

2. Arranca con `npm run dev` y en la otra terminal haz **dos o tres
   peticiones**: `curl http://localhost:3000/health/live`.
3. **Esperado**: en la terminal del **servidor** (no la del curl) aparece
   una línea `GET /health/live` por cada petición. Estás viendo la misma
   petición que enviaste con Bruno en el Topic 02, ahora desde el
   servidor.
4. Prueba también una URL que no existe
   (`curl http://localhost:3000/nope`) y observa: **no aparece ningún
   log** — no hay ninguna ruta que coincida, así que ningún handler (ni
   su log) se ejecuta. La petición existió, pero no llegó a pasar por
   vuestro código.

```text
<pega aquí la salida de la terminal del servidor: las líneas
"GET /health/live" de tus peticiones>
```

## Ejercicio 2 — responder con lo que llega (`GET /echo`)

1. En `src/app.ts`, **dentro de `createApp()`** y antes del `return app`,
   añade una ruta temporal:

   ```ts
   // TEMPORAL: se quita al final de la actividad
   app.get('/echo', (req, res) => {
     res.json({ method: req.method, path: req.path, query: req.query });
   });
   ```

2. Sin reiniciar el servidor (el script `dev` recarga solo), pide:

   ```bash
   curl "http://localhost:3000/echo?name=Ada&curso=dsw"
   ```

3. **Esperado**: el servidor responde con un JSON que describe **la
   petición que acabas de enviar**:

   ```json
   {"method":"GET","path":"/echo","query":{"name":"Ada","curso":"dsw"}}
   ```

   Los query params que en el Topic 02 escribíais en Bruno tras el `?`
   ahora llegan parseados en `req.query`. La respuesta no es un texto
   fijo: **se construye a partir de `req`** y sale a través de `res`.

## Ejercicio 3 — `res` manda en la respuesta (probar un 201)

1. En `src/routes/health.ts`, cambia el código de estado temporalmente:

   ```ts
   res.status(201).json({ status: 'live' }); // TEMPORAL: volver a 200
   ```

2. Pide con cabeceras visibles: `curl -sS -i http://localhost:3000/health/live`.
3. **Esperado**: la primera línea dice `HTTP/1.1 201 Created` (antes
   decía `200 OK`). El código de estado no es magia: **lo eliges tú** con
   `res.status()`. Sin llamarlo, Express responde `200` por defecto.
4. **Revierte a `200`**: el endpoint `/health/live` tiene un **contrato**
   — `200` con el cuerpo exacto `{"status":"live"}` — y los contratos no
   se cambian para hacer un experimento.



