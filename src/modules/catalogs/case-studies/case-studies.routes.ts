import express from 'express';
import { validateBody } from '../../../common/validators/validateBody';
import { handleAsyncErrors } from '../../../common/helpers/asyncErrorHandler';
import {
  createCaseStudyCtrl,
  deleteCaseStudyCtrl,
  getAllCaseStudiesCtrl,
  getOneCaseStudyCtrl,
  updateCaseStudyCtrl,
} from './controllers/case-study.controller';
import { CreateCaseStudyInput } from './dto/create-case-study.input';

const router: express.Router = express.Router();

router.get('/', handleAsyncErrors(getAllCaseStudiesCtrl));
router.get('/:id', handleAsyncErrors(getOneCaseStudyCtrl));
router.post('/', validateBody(CreateCaseStudyInput), handleAsyncErrors(createCaseStudyCtrl));
router.patch('/', validateBody(CreateCaseStudyInput), handleAsyncErrors(updateCaseStudyCtrl));
router.delete('/:id', handleAsyncErrors(deleteCaseStudyCtrl));

export const caseStudyRoutes = router;
