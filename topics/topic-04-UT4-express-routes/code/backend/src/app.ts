import { randomUUID } from 'node:crypto';
import express from 'express';
import type { Application } from 'express';

interface Document {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Simplest possible implementation: logic lives in the route and data lives
// in an in-memory array. No controllers, services or middleware yet.
export function createApp(): Application {
  const app = express();
  app.use(express.json());

  const documents: Document[] = [];

  app.post('/api/v1/questions', (req, res) => {
    const { question } = req.body ?? {};

    if (typeof question !== 'string' || question.trim().length === 0) {
      res.status(400).json({ error: 'INVALID_QUESTION' });
      return;
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

  app.get('/api/v1/admin/documents', (_req, res) => {
    res.json({ documents });
  });

  app.post('/api/v1/admin/documents', (req, res) => {
    const { title, description } = req.body ?? {};

    if (typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'MISSING_TITLE' });
      return;
    }

    const document: Document = {
      id: randomUUID(),
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      createdAt: new Date().toISOString(),
    };
    documents.push(document);
    res.status(201).json({ document });
  });

  app.get('/api/v1/admin/documents/:documentId', (req, res) => {
    const document = documents.find((item) => item.id === req.params.documentId);

    if (!document) {
      res.status(404).json({ error: 'NOT_FOUND' });
      return;
    }
    res.json({ document });
  });

  app.patch('/api/v1/admin/documents/:documentId', (req, res) => {
    const document = documents.find((item) => item.id === req.params.documentId);

    if (!document) {
      res.status(404).json({ error: 'NOT_FOUND' });
      return;
    }

    const { title, description } = req.body ?? {};
    if (typeof title === 'string' && title.trim().length > 0) {
      document.title = title.trim();
    }
    if (typeof description === 'string') {
      document.description = description.trim();
    }
    res.json({ document });
  });

  return app;
}
