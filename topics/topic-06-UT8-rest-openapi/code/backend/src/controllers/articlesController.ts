// Controllers layer: reads req, checks the input by hand, calls the service
// and answers. Errors are thrown as AppError and handed to the central
// errorHandler with next(err).

import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import * as articlesService from '../services/articlesService.js';

export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    // req.query always arrives as text: the controller converts it.
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    res.json(articlesService.list(page, limit));
  } catch (err) {
    next(err);
  }
}

export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const article = articlesService.getById(String(req.params.articleId));
    if (!article) {
      throw new AppError(404, `Article with id '${req.params.articleId}' not found`, 'NOT_FOUND');
    }
    res.json({ data: article });
  } catch (err) {
    next(err);
  }
}

export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body;
    if (!title || typeof title !== 'string') {
      throw new AppError(400, 'Missing required field: title', 'BAD_REQUEST');
    }
    const article = articlesService.create(
      title.trim(),
      typeof description === 'string' ? description.trim() : '',
    );
    res.status(201).json({ data: article });
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body;
    const article = articlesService.update(String(req.params.articleId), { title, description });
    if (!article) {
      throw new AppError(404, `Article with id '${req.params.articleId}' not found`, 'NOT_FOUND');
    }
    res.json({ data: article });
  } catch (err) {
    next(err);
  }
}
