import express from 'express';
import { validateBody } from '../../common/validators/validateBody';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';
import { RegisterInput } from '../subscriber/dto/register.input';
import {
  changeSubscriberStatusByIdCtrl,
  createSubscriberCtrl,
  deleteSubscriberCtrl,
  getAllSubscriberCtrl,
  getSubscriberByIdCtrl,
} from './controllers/subscriber.controller';
import { UpdateStatusInputValidator } from './dto/updateStatus.input';

const router: express.Router = express.Router();

router.post('/', validateBody(RegisterInput), handleAsyncErrors(createSubscriberCtrl));
router.get('/', handleAsyncErrors(getAllSubscriberCtrl));
router.get('/:id', handleAsyncErrors(getSubscriberByIdCtrl));
router.patch('/:id/:status', UpdateStatusInputValidator, handleAsyncErrors(changeSubscriberStatusByIdCtrl));
router.delete('/:id', handleAsyncErrors(deleteSubscriberCtrl));

export const subscriberRoutes = router;
