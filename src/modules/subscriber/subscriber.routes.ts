import express from 'express';
import { validateBody } from '../../common/validators/validateBody';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';
import { RegisterInput } from '../subscriber/dto/register.input';
import * as subscriberController from './controllers/subscriber.controller';
import { UpdateStatusInputValidator } from './dto/updateStatus.input';
import { CreateSubscriberInput } from './dto/create.subscriber.input';
import { UpdateSubscriberUserInput } from './dto/update.subscriber.user.input';
import { changePasswordInput } from '../../common/dto/changePassword.input';

const router: express.Router = express.Router();

router.post('/', validateBody(RegisterInput), handleAsyncErrors(subscriberController.createSubscriberCtrl));
router.get('/', handleAsyncErrors(subscriberController.getAllSubscriberCtrl));
router.get('/:id', handleAsyncErrors(subscriberController.getSubscriberByIdCtrl));
router.patch(
  '/:id/:status',
  UpdateStatusInputValidator,
  handleAsyncErrors(subscriberController.changeSubscriberStatusByIdCtrl),
);
router.delete('/:id', handleAsyncErrors(subscriberController.deleteSubscriberCtrl));
router.get('/users', handleAsyncErrors(subscriberController.getSubscriberUsers));
router.post(
  '/users',
  validateBody(CreateSubscriberInput),
  handleAsyncErrors(subscriberController.subscriberCreateUser),
);
router.patch(
  '/users',
  validateBody(UpdateSubscriberUserInput),
  handleAsyncErrors(subscriberController.subscriberUpdateUser),
);
router.patch(
  '/changePassword',
  validateBody(changePasswordInput),
  handleAsyncErrors(subscriberController.subscriberChangePassword),
);

export const subscriberRoutes = router;
