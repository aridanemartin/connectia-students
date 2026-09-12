# Enviar GET /health y leer la respuesta — Actividad 4

## Para qué sirve esta actividad

Toda respuesta HTTP tiene tres partes que vais a leer **todas las semanas**
del curso: el **código de estado**, las **cabeceras** y el **cuerpo**. Esta
actividad practica identificar las tres partes usando la petición más
simple de la colección: `GET /health`, que siempre responde `200 OK`
mientras el servidor esté vivo.

## Pasos

1. Con el demo backend corriendo, en Bruno abre la petición `01-health`.
2. Pulsa **Send**.
3. Observa el panel de respuesta: código de estado (arriba, junto al
   tiempo de respuesta), pestaña **Headers** y pestaña **Body**.

## Apuntes: qué significa cada parte

- **Código de estado** (`200`) — un número de tres cifras que resume el
  resultado. `2xx` = éxito. Más adelante veréis `4xx` (error del cliente,
  como en la Actividad 7) y `5xx` (error del servidor).
- **Cabeceras** (*headers*) — metadatos sobre la respuesta. Por ejemplo,
  `Content-Type: application/json; charset=utf-8` le dice al cliente cómo
  interpretar el cuerpo.
- **Cuerpo** (*body*) — los datos reales de la respuesta. Aquí es JSON:
  `{"status":"ok"}`.

