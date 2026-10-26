# Actividad 01 — Verbos HTTP: elige el método correcto

## Objetivo

Entender qué significa cada verbo HTTP y elegir el correcto para cada caso de
uso de Connectia.

> **Dónde trabajas**: en el **repositorio del backend** de tu equipo.

## Apuntes: el verbo es la acción

En una API el **path nombra el recurso** (un sustantivo) y el **verbo HTTP
aporta la acción**. No existe un verbo «leer» ni «crear» en el path: se usan
los métodos HTTP.

Ejemplo con una app distinta de Connectia (una lista de tareas):

| Verbo | Significado | Ejemplo |
|-------|-------------|---------|
| `GET` | Lee una tarea | `GET /api/v1/tasks` |
| `POST` | Crear una tarea | `POST /api/v1/tasks` |
| `PUT` | Reemplazar una tarea entera | `PUT /api/v1/tasks/{id}` |
| `PATCH` | Modificar **parte** de una tarea por ejemplo su título o la persona asignada | `PATCH /api/v1/tasks/{id}` |
| `DELETE` | Eliminar una tarea | `DELETE /api/v1/tasks/{id}` |

El verbo **nunca** va en el path. `/getTasks` o `/createTask` están mal;
`GET /tasks` y `POST /tasks` están bien.

Fíjate en el detalle: la misma ruta `/api/v1/tasks` cambia de significado según
el método. `GET` la lee; `POST` crea. Y lo mismo con `/api/v1/tasks/{id}`:
`GET` lo consulta, `PUT`/`PATCH` lo modifican y `DELETE` lo borra.

## Ejercicio: tradúcelo a Connectia

Ahora te toca a ti. Relaciona cada **caso de uso de Connectia** con el **verbo**
y la **ruta** que le corresponden, y anota el **código de estado** de éxito.

Completa la tabla:

| Caso de uso de Connectia | Verbo | Ruta | Éxito |
|--------------------------|-------|------|-------|
| Enviar una pregunta a la IA (respuesta simulada) | | | |
| Listar los documentos de la base de conocimiento | | | |
| Crear los metadatos de un documento nuevo | | | |
| Consultar un documento por su `documentId` | | | |
| Modificar **solo** el `title` de un documento | | | |

**Pistas** (para las rutas, no para los verbos):

- Todas las rutas de Connectia empiezan por `/api/v1`.
- Los documentos cuelgan de `/api/v1/admin/documents`.
- Una pregunta se envía a `/api/v1/questions`.
- Un documento concreto se identifica con `{documentId}` al final de la ruta.

## Preguntas

1. En el caso «Enviar una pregunta a la IA» el método es `POST`, pero el éxito
   ¿es `200` o `201`? ¿Por qué? (Recuerda revisar http.cat 😉)
2. Para cambiar solo el `title` de un documento, ¿por qué usamos `PATCH` y no
   `PUT`?
3. ¿Por qué «Listar los documentos» es `GET` y no `POST`?
4. Escribe una ruta **mal** con el verbo en el path y su versión correcta.
