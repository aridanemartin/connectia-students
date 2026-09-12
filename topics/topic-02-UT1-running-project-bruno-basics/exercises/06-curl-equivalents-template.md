# De Bruno a curl (y viceversa) — Actividad 6

## Para qué sirve esta actividad

Bruno es cómodo para explorar, pero `curl` está disponible en **cualquier**
terminal sin instalar nada, funciona dentro de scripts automatizados, y es
lo que veréis en documentación técnica, *issues* de GitHub y ejemplos de
API en internet. Saber traducir entre ambos es una habilidad que usaréis
constantemente: en esta actividad consolidáis, en un solo documento, el
comando `curl` equivalente a **cada** petición de la colección de Bruno.

## Apuntes: anatomía de un comando curl

```bash
curl -sS -i "http://localhost:3000/hello?name=Ada"
```

- `curl` — el programa.
- `-sS` — modo silencioso (`-s`) pero mostrando errores si los hay (`-S`).
  Evita la barra de progreso, mantiene los mensajes de error útiles.
- `-i` — incluye las cabeceras de la respuesta en la salida (no solo el
  cuerpo).
- La URL entre comillas — las comillas evitan que la terminal interprete
  el `&` de una *query string* con varios parámetros como un operador de
  shell.

Por defecto, `curl` hace una petición `GET`. Para otros métodos (`POST`,
`PUT`...) se añade `-X MÉTODO`, pero esta semana solo trabajamos con `GET`.

## Tabla de equivalencias

Completa la tabla con el comando `curl` exacto para cada petición de la
colección `code/bruno/`:

| Petición Bruno | Comando curl |
|----------------|--------------|
| `01-health` | `<tu comando>` |
| `02-hello-default` | `<tu comando>` |
| `03-hello-with-name` (con `name=Ada`) | `<tu comando>` |
| `04-not-found-demo` | `<tu comando>` |
