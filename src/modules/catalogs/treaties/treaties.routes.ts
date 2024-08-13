import express from 'express';
import { validateBody } from '../../../common/validators/validateBody';
import { handleAsyncErrors } from '../../../common/helpers/asyncErrorHandler';
import {
  createTreatyCtrl,
  deleteTreatyCtrl,
  getAllTreatiesCtrl,
  getOneTreatyCtrl,
  updateTreatyCtrl,
} from './controllers/treaty.controller';
import { CreateTreatyInput } from './dto/create-treaty.input';

const router: express.Router = express.Router();

router.get('/', handleAsyncErrors(getAllTreatiesCtrl));
router.get('/:id', handleAsyncErrors(getOneTreatyCtrl));
router.post('/', validateBody(CreateTreatyInput), handleAsyncErrors(createTreatyCtrl));
router.patch('/:id', validateBody(CreateTreatyInput), handleAsyncErrors(updateTreatyCtrl));
router.delete('/:id', handleAsyncErrors(deleteTreatyCtrl));

export const treatyRoutes = router;
