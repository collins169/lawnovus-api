import express from 'express';
import { validateBody } from '../../../common/validators/validateBody';
import { handleAsyncErrors } from '../../../common/helpers/asyncErrorHandler';
import { CategoryTypeInput } from './dto/category.input';
import {
  addCategoryCtrl,
  deleteCategoryTypeCtrl,
  editCategoryCtrl,
  getCategoriesCtrl,
  getCategoryByIdCtrl,
} from './controllers/category.controller';

const router: express.Router = express.Router();

router.post('/', validateBody(CategoryTypeInput), handleAsyncErrors(addCategoryCtrl));
router.get('/', handleAsyncErrors(getCategoriesCtrl));
router.get('/:id', handleAsyncErrors(getCategoryByIdCtrl));
router.patch('/:id', validateBody(CategoryTypeInput), handleAsyncErrors(editCategoryCtrl));
// router.patch('/:id/:status', handleAsyncErrors(changeOrganizationTypeStatusCtrl));
router.delete('/:id', handleAsyncErrors(deleteCategoryTypeCtrl));

export const categoryRoutes = router;
