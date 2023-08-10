import { Response, Request } from 'express';
import { AuthUserInput } from '../dto/authUser.input';
import { login, register } from '../services/auth.service';
import { HttpStatus } from '@nestjs/common';
import { RegisterInput } from '../../subscriber/dto/register.input';

export const loginCtrl = async (req: Request, res: Response) => {
  const { username, password } = req.body as AuthUserInput;
  const { user, token } = await login({ username, password });
  return res.status(HttpStatus.ACCEPTED).json({ user, token });
};

export const registerCtrl = async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  await register(input);
  return res.sendStatus(HttpStatus.NO_CONTENT);
};
