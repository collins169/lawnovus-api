import express from 'express';
// import { AddUserInput } from './dto/addUser.input';
// import { addUserCtrl, getUserByIdCtrl, getUsersCtrl } from './controllers/user.controller';
import { handleAsyncErrors } from '../../common/helpers/asyncErrorHandler';
import { validateBody } from '../../common/validators/validateBody';

const router: express.Router = express.Router();

// router.post('/', validateBody(AddUserInput), handleAsyncErrors(addUserCtrl));
// router.get('/', handleAsyncErrors(getUsersCtrl));
// router.get('/:id', handleAsyncErrors(getUserByIdCtrl));
// router.get('/self', handleAsyncErrors(getUserByIdCtrl));

export const userRoutes = router;
