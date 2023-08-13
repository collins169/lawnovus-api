import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { validateToken } from '../../modules/auth/services/auth.service';

export const JWTTokenHandler = async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new UnauthorizedException('No "Authorization" header value present'));
  }

  try {
    const user = await validateToken(authorization);
    req['user'] = user;
    next();
  } catch (error) {
    return next(error);
  }
};
