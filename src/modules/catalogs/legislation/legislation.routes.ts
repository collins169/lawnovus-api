import express from 'express';
import { validateBody } from '../../../common/validators/validateBody';
import { handleAsyncErrors } from '../../../common/helpers/asyncErrorHandler';
import {
  createLegislationCtrl,
  deleteLegislationCtrl,
  getAllLegislationCtrl,
  getOneLegislationCtrl,
  updateLegislationCtrl,
} from './controllers/legislation.controller';
import { CreateLegislationInput } from './dto/create-legislation.input';

const router: express.Router = express.Router();

router.get('/', handleAsyncErrors(getAllLegislationCtrl));
router.get('/:id', handleAsyncErrors(getOneLegislationCtrl));
router.post('/', validateBody(CreateLegislationInput), handleAsyncErrors(createLegislationCtrl));
router.patch('/:id', validateBody(CreateLegislationInput), handleAsyncErrors(updateLegislationCtrl));
router.delete('/:id', handleAsyncErrors(deleteLegislationCtrl));

export const caseStudyRoutes = router;
