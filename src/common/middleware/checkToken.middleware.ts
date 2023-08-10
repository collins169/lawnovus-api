import { NextFunction, Request, Response } from 'express';
import { validateToken } from '../../modules/admin/services/administrator.service';
import { UnauthorizedException } from '@nestjs/common';

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
