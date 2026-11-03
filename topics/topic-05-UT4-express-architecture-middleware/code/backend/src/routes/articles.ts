// Routes layer: only maps method + path to a controller function.
// Same URLs as the Topic 04 router; the logic now lives in the controller
// (HTTP) and in the service (data).

import { Router } from 'express';

import * as articlesController from '../controllers/articlesController.js';

export const articlesRouter = Router();

articlesRouter.get('/', articlesController.list);
articlesRouter.post('/', articlesController.create);
articlesRouter.get('/:articleId', articlesController.getById);
articlesRouter.patch('/:articleId', articlesController.update);
