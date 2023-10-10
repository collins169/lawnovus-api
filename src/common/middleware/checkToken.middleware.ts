import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { validateToken } from '../../modules/auth/services/auth.service';

export const JWTTokenHandler = async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization, origin } = req.headers;

  if (origin === process.env.WEBSITE_URL) {
    req['user'] = { username: 'website', id: 'website-id', role: 'ADMIN' };
    return next();
  }

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
