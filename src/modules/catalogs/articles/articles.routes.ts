import express from 'express';
import { validateBody } from '../../../common/validators/validateBody';
import { handleAsyncErrors } from '../../../common/helpers/asyncErrorHandler';
import {
  createArticleCtrl,
  deleteArticleCtrl,
  getAllArticlesCtrl,
  getOneArticleCtrl,
  updateArticleCtrl,
} from './controllers/article.controller';
import { CreateArticleInput } from './dto/create-article.input';

const router: express.Router = express.Router();

router.get('/', handleAsyncErrors(getAllArticlesCtrl));
router.get('/:id', handleAsyncErrors(getOneArticleCtrl));
router.post('/', validateBody(CreateArticleInput), handleAsyncErrors(createArticleCtrl));
router.patch('/:id', validateBody(CreateArticleInput), handleAsyncErrors(updateArticleCtrl));
router.delete('/:id', handleAsyncErrors(deleteArticleCtrl));

export const articleRoutes = router;
