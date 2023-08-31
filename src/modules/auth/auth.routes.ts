import express from 'express';
import { validateBody } from '../../common/validators/validateBody';
import { AuthUserInput } from './dto/authUser.input';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';
import { adminLoginCtrl, getCurrentUserCtrl, loginCtrl, registerCtrl } from './controllers/auth.controller';
import { RegisterInput } from '../subscriber/dto/register.input';

const router: express.Router = express.Router();

router.get('/', handleAsyncErrors(getCurrentUserCtrl));
router.post('/login', validateBody(AuthUserInput), handleAsyncErrors(loginCtrl));
router.post('/admin/login', validateBody(AuthUserInput), handleAsyncErrors(adminLoginCtrl));
router.post('/register', validateBody(RegisterInput), handleAsyncErrors(registerCtrl));

export const authRoutes = router;
