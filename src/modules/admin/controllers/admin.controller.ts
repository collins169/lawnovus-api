import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { AuthUserInput } from '../../auth/dto/authUser.input';
import { addAdmin, adminLogin, changeAdminPassword, listAdminUser } from '../services/administrator.service';
import { AuthenticatedRequest } from '../../../common/types';
import { AddAdminInput } from '../dto/addAdmin.input';
import { changePasswordInput } from '../dto/changePassword.input';

export const adminLoginCtrl = async (req: Request, res: Response) => {
  const { username, password } = req.body as AuthUserInput;
  const { user, token } = await adminLogin({ username, password });
  return res.status(HttpStatus.ACCEPTED).json({ user, token });
};

export const addAdminCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const input = req.body as AddAdminInput;
  const {
    user: { id },
  } = req;
  await addAdmin(input, id);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const changePasswordCtrl = async (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body as changePasswordInput;
  const {
    user: { id },
  } = req;

  await changeAdminPassword({ id, oldPassword, newPassword });
  return res.sendStatus(HttpStatus.NO_CONTENT);
};

export const listAdminUserCtrl = async (_: AuthenticatedRequest, res: Response) => {
  const users = await listAdminUser();
  return res.status(HttpStatus.OK).json(users);
};
