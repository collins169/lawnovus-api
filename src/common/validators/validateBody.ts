import { BadRequestException } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../helpers/logger';

export const checkValidationErrors = async <T>({
  DtoClass,
  plainObj,
}: {
  DtoClass: ClassConstructor<T>;
  plainObj: Record<string, unknown>;
}) => {
  const input = plainToInstance(DtoClass, plainObj, {
    enableImplicitConversion: true,
  });

  // eslint-disable-next-line @typescript-eslint/ban-types
  const errors = await validate(<object>(<unknown>input), {
    validationError: { target: false },
    forbidUnknownValues: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  return { errors, input };
};

export const validateBody =
  <T>(DtoClass: ClassConstructor<T>) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const { errors, input } = await checkValidationErrors<T>({
      DtoClass,
      plainObj: req.body,
    });

    if (errors.length > 0) {
      logger.info({ errors });
      const errorMessages = errors.map(({ constraints }) => Object.values(constraints)[0]);
      return next(new BadRequestException(errorMessages));
    }

    req.body = input;

    next();
  };
