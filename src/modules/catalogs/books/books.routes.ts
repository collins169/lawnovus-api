import express from 'express';
import { validateBody } from '../../../common/validators/validateBody';
import { handleAsyncErrors } from '../../../common/helpers/asyncErrorHandler';
import {
  createBookCtrl,
  deleteBookCtrl,
  getAllBooksCtrl,
  getOneBookCtrl,
  updateBookCtrl,
} from './controllers/book.controller';
import { CreateBookInput } from './dto/create-book.input';

const router: express.Router = express.Router();

router.get('/', handleAsyncErrors(getAllBooksCtrl));
router.get('/:id', handleAsyncErrors(getOneBookCtrl));
router.post('/', validateBody(CreateBookInput), handleAsyncErrors(createBookCtrl));
router.patch('/:id', validateBody(CreateBookInput), handleAsyncErrors(updateBookCtrl));
router.delete('/:id', handleAsyncErrors(deleteBookCtrl));

export const bookRoutes = router;
