import express from 'express';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';
import { validateBody } from '../../common/validators/validateBody';
import { addAdminCtrl, changePasswordCtrl, listAdminUserCtrl } from './controllers/admin.controller';
import { AddAdminInput } from './dto/addAdmin.input';
import { changePasswordInput } from './dto/changePassword.input';

const router: express.Router = express.Router();

router.post('/', validateBody(AddAdminInput), handleAsyncErrors(addAdminCtrl));
router.get('/', handleAsyncErrors(listAdminUserCtrl));
router.patch('/change-password/self', validateBody(changePasswordInput), handleAsyncErrors(changePasswordCtrl));

export const adminRoutes = router;
