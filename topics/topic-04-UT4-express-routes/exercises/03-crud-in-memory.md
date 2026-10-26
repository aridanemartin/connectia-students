# Actividad 03 — CRUD en memoria: los cinco endpoints de Connectia

## Objetivo

Implementar los cinco endpoints del proyecto **de la forma más sencilla
posible**: lógica en la ruta y un array en memoria.

> **Dónde trabajas**: en el **repositorio del backend** de tu equipo. No crees
> controladores ni servicios todavía: eso es el Topic 05.

## Los cinco endpoints

| Método | Ruta | Qué hace | Éxito / Error |
|--------|------|----------|-------|
| `POST` | `/api/v1/questions` | Devuelve una respuesta simulada fija con citas | `200` |
| `GET` | `/api/v1/admin/documents` | Lista de documentos (en memoria) | `200` |
| `POST` | `/api/v1/admin/documents` | Crea metadatos de un documento | `201` |
| `GET` | `/api/v1/admin/documents/:documentId` | Consulta un documento | `200` / `404` |
| `PATCH` | `/api/v1/admin/documents/:documentId` | Modifica campos enviados | `200` / `404` |

## Apuntes: leer `params` y `query`

```ts
app.get('/api/v1/admin/documents/:documentId', (req, res) => {
  const { documentId } = req.params; // /documents/abc -> "abc"
  const document = documents.find((d) => d.id === documentId);

  if (!document) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }
  res.json({ document });
});
```

Recuerda: `req.params` y `req.query` **son texto**. Si necesitas un número,
conviértelo con `Number(...)`.

## Apuntes: el mock de preguntas (sin IA)

```ts
app.post('/api/v1/questions', (req, res) => {
  const { question } = req.body;

  if (typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'INVALID_QUESTION' });
  }

  res.json({
    data: {
      answer: 'Respuesta simulada: consulta la documentación pública del centro.',
      citations: [
        {
          documentId: '11111111-1111-4111-8111-111111111111',
          title: 'Guía pública del centro',
          excerpt: 'La información actualizada está disponible en los canales oficiales.',
        },
      ],
    },
  });
});
```

## Ejercicio

1. Implementa los **cinco** endpoints con un array en memoria.
2. Usa el verbo correcto en cada uno y devuelve JSON.
3. Devuelve `404` cuando el `documentId` no exista.
4. No añadas capas ni middleware: la lógica va en la ruta.

