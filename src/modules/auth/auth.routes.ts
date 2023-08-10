import express from 'express';
import { validateBody } from '../../common/validators/validateBody';
import { AuthUserInput } from './dto/authUser.input';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';
import { loginCtrl, registerCtrl } from './controllers/auth.controller';
import { RegisterInput } from '../subscriber/dto/register.input';
import { adminLoginCtrl } from '../admin/controllers/admin.controller';

const router: express.Router = express.Router();

router.post('/login', validateBody(AuthUserInput), handleAsyncErrors(loginCtrl));
router.post('/auth/login', validateBody(AuthUserInput), handleAsyncErrors(adminLoginCtrl));
router.post('/register', validateBody(RegisterInput), handleAsyncErrors(registerCtrl));

export const authRoutes = router;
