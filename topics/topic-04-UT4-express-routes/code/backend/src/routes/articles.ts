// Topic 04: the simplest implementation that works. Practice resource with
// the same shape as a Connectia document (id, title, description, createdAt).
// The logic lives inside each route and the data lives in an in-memory array
// (lost on restart). No controllers, services or custom middleware yet:
// Topic 05 splits this file into routes → controllers → services.

import { randomUUID } from 'node:crypto';
import { Router } from 'express';

interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export const articlesRouter = Router();

const articles: Article[] = [];

// GET /api/v1/articles?page=1&limit=20
articlesRouter.get('/', (req, res) => {
  // req.query always arrives as text: convert it before doing maths.
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const start = (page - 1) * limit;

  res.json({
    data: articles.slice(start, start + limit),
    pagination: { page, limit, total: articles.length },
  });
});

// POST /api/v1/articles
articlesRouter.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'MISSING_TITLE' });
  }

  const article: Article = {
    id: randomUUID(),
    title,
    description: description ?? '',
    createdAt: new Date().toISOString(),
  };
  articles.push(article);
  res.status(201).json({ data: article });
});

// GET /api/v1/articles/:articleId
articlesRouter.get('/:articleId', (req, res) => {
  const article = articles.find((item) => item.id === req.params.articleId);

  if (!article) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }

  res.json({ data: article });
});

// PATCH /api/v1/articles/:articleId — only the fields that are sent change.
articlesRouter.patch('/:articleId', (req, res) => {
  const article = articles.find((item) => item.id === req.params.articleId);

  if (!article) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }

  const { title, description } = req.body;
  if (title !== undefined) {
    article.title = title;
  }
  if (description !== undefined) {
    article.description = description;
  }

  res.json({ data: article });
});
